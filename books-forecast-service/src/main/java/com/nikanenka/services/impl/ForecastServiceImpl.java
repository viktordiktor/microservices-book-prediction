package com.nikanenka.services.impl;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.ForecastResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.SellingResponse;
import com.nikanenka.exceptions.ForecastNotFoundException;
import com.nikanenka.models.Forecast;
import com.nikanenka.repositories.ForecastRepository;
import com.nikanenka.services.ForecastService;
import com.nikanenka.services.feign.BookService;
import com.nikanenka.services.feign.SellService;
import com.nikanenka.utils.ExcelUtil;
import com.nikanenka.utils.ForecastUtil;
import com.nikanenka.utils.LogList;
import com.nikanenka.utils.PageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForecastServiceImpl implements ForecastService {
    private final ForecastRepository forecastRepository;
    private final SellService sellService;
    private final BookService bookService;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<ForecastResponse> getAllForecasts(int pageNumber, int pageSize, String sortField, String sortType) {
        Pageable pageable = PageUtil
                .createPageable(pageNumber, pageSize, sortField, sortType, SellingResponse.class);

        Page<Forecast> page = forecastRepository.findAll(pageable);

        List<ForecastResponse> forecasts = page.getContent().stream()
                .map(forecast -> {
                    ForecastResponse response = modelMapper.map(forecast, ForecastResponse.class);

                    if (forecast.getPreviousSales() != null) {
                        Map<LocalDate, Integer> sortedSales = new LinkedHashMap<>();
                        forecast.getPreviousSales().entrySet().stream()
                                .sorted(Map.Entry.<LocalDate, Integer>comparingByKey().reversed())
                                .forEachOrdered(entry -> sortedSales.put(entry.getKey(), entry.getValue()));

                        response.setPreviousSales(sortedSales);
                    }

                    return response;
                })
                .toList();
        forecasts.forEach(forecast -> {
            BookResponse bookResponse = bookService.getBookById(forecast.getBookId());
            if (bookResponse.getErrorMessage() == null) {
                forecast.setBookTitle(bookResponse.getTitle());
            }
        });

        return PageResponse.<ForecastResponse>builder()
                .objectList(forecasts)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    public Resource getExcelAllForecasts() {
        return ExcelUtil.generateForecastExport(forecastRepository.findAll());
    }

    @Override
    public ForecastResponse getForecastById(UUID id) {
        Forecast forecast = getOrThrow(id);
        log.info(LogList.LOG_GET_FORECAST, id);
        ForecastResponse forecastResponse = modelMapper.map(forecast, ForecastResponse.class);
        BookResponse bookResponse = bookService.getBookById(forecast.getBookId());
        if (bookResponse.getErrorMessage() == null) {
            forecastResponse.setBookTitle(bookResponse.getTitle());
        }
        return forecastResponse;
    }

    @Override
    public ForecastResponse getForecastByBookId(UUID bookId) {
        Optional<Forecast> optionalForecastByBook = forecastRepository.findByBookId(bookId);
        return modelMapper.map(
                optionalForecastByBook.orElseThrow(ForecastNotFoundException::new), ForecastResponse.class);
    }

    @Override
    @Transactional
    public ForecastResponse createForecast(ForecastRequest createForecastRequest) {
        Forecast savingForecast = modelMapper.map(createForecastRequest, Forecast.class);
        BookResponse book = bookService.getBookById(createForecastRequest.getBookId());

        Optional<Forecast> optionalForecastByBook = forecastRepository.findByBookId(book.getId());
        if (optionalForecastByBook.isPresent()) {
            forecastRepository.deleteById(optionalForecastByBook.get().getId());
        }

        LocalDate monthAgoDate = LocalDate.now().minusMonths(1);
        List<SellingResponse> bookSellsByDays = sellService.getDaySellsByBookIdAndDate(
                book.getId(), monthAgoDate, LocalDate.now());
        TreeMap<LocalDate, Integer> existingBookSells = new TreeMap<>();
        for (SellingResponse bookDaySell : bookSellsByDays) {
            existingBookSells.put(bookDaySell.getDate(), bookDaySell.getAmount());
        }
        savingForecast.setPreviousSales(existingBookSells);

        int soldBooks = bookSellsByDays.stream().mapToInt(SellingResponse::getAmount).sum();
        double averageSells = (double) soldBooks / ChronoUnit.DAYS.between(monthAgoDate, LocalDate.now());

        double insuranceStock = ForecastUtil.getInsuranceStock(createForecastRequest, averageSells);
        savingForecast.setInsuranceStock(insuranceStock);
        savingForecast.setRoundedInsuranceStock((int) Math.ceil(insuranceStock));

        double orderPoint = ForecastUtil.getOrderPoint(createForecastRequest, averageSells);
        savingForecast.setOrderPoint(orderPoint);
        savingForecast.setRoundedOrderPoint((int) Math.ceil(orderPoint));

        double optimalBatch = ForecastUtil.getOptimalBatch(createForecastRequest, soldBooks);
        savingForecast.setOptimalBatchSize(optimalBatch);
        savingForecast.setRoundedOptimalBatchSize((int) Math.ceil(optimalBatch));

        savingForecast.setCreatedDate(LocalDate.now());
        savingForecast.setCurrentAmount(book.getAmount());

        forecastRepository.save(savingForecast);
        return modelMapper.map(savingForecast, ForecastResponse.class);
    }

    @Override
    public void removeForecast(UUID id) {
        forecastRepository.delete(getOrThrow(id));
        log.info(LogList.LOG_DELETE_FORECAST, id);
    }

    private Forecast getOrThrow(UUID id) {
        Optional<Forecast> optionalSelling = forecastRepository.findById(id);
        return optionalSelling.orElseThrow(ForecastNotFoundException::new);
    }
}
