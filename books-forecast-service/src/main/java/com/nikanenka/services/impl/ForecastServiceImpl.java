package com.nikanenka.services.impl;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.ForecastResponse;
import com.nikanenka.dto.GlobalForecastResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.SellingResponse;
import com.nikanenka.exceptions.ForecastNotFoundException;
import com.nikanenka.models.Forecast;
import com.nikanenka.models.ForecastMethod;
import com.nikanenka.models.GlobalForecast;
import com.nikanenka.repositories.ForecastRepository;
import com.nikanenka.repositories.GlobalForecastRepository;
import com.nikanenka.services.ForecastService;
import com.nikanenka.services.feign.BookService;
import com.nikanenka.services.feign.SellService;
import com.nikanenka.utils.ForecastUtil;
import com.nikanenka.utils.LogList;
import com.nikanenka.utils.PageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.TreeMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForecastServiceImpl implements ForecastService {
    private final ForecastRepository forecastRepository;
    private final GlobalForecastRepository globalForecastRepository;
    private final SellService sellService;
    private final BookService bookService;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<GlobalForecastResponse> getAllForecasts(int pageNumber, int pageSize, String sortField, String sortType, String searchRequest) {
        Pageable pageable = PageUtil
                .createPageable(pageNumber, pageSize, sortField, sortType, SellingResponse.class);

        Page<GlobalForecast> page;
        if (searchRequest != null && !searchRequest.trim().isEmpty()) {
            page = globalForecastRepository.searchByFields(searchRequest, pageable);
        } else {
            page = globalForecastRepository.findAll(pageable);
        }

        List<GlobalForecastResponse> forecasts = page.getContent().stream()
                .map(forecast -> modelMapper.map(forecast, GlobalForecastResponse.class))
                .toList();

        return PageResponse.<GlobalForecastResponse>builder()
                .objectList(forecasts)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    public GlobalForecastResponse getForecastById(UUID id) {
        GlobalForecast globalForecast = getOrThrow(id);
        log.info(LogList.LOG_GET_FORECAST, id);
        GlobalForecastResponse forecastResponse = modelMapper.map(globalForecast, GlobalForecastResponse.class);
        forecastResponse.setForecastResponses(globalForecast.getForecasts()
                .stream()
                .map(forecast -> modelMapper.map(forecast, ForecastResponse.class))
                .toList());
        return forecastResponse;
    }

    @Override
    @Transactional
    public GlobalForecastResponse createForecast(ForecastRequest createForecastRequest) {
        BookResponse book = bookService.getBookById(createForecastRequest.getBookId());
        List<SellingResponse> bookSellsByDays = sellService.getDaySellsByBookIdAndDate(
                book.getId(), createForecastRequest.getFromDate(), createForecastRequest.getToDate());
        TreeMap<LocalDate, Integer> existingBookSells = new TreeMap<>();
        for (SellingResponse bookDaySell : bookSellsByDays) {
            existingBookSells.put(bookDaySell.getDate(), bookDaySell.getAmount());
        }

        GlobalForecast globalForecast = modelMapper.map(createForecastRequest, GlobalForecast.class);

        List<Forecast> forecastsToSave = new ArrayList<>();
        if (createForecastRequest.getMethods().contains(ForecastMethod.EXPONENTIAL_SMOOTHING)) {
            Forecast forecast = ForecastUtil.getExponentialSmoothingForecast(book, bookSellsByDays, createForecastRequest);
            forecast.setGlobalForecast(globalForecast);
            forecastsToSave.add(forecast);
        }
        if (createForecastRequest.getMethods().contains(ForecastMethod.LINEAR_REGRESSION)) {
            Forecast forecast = ForecastUtil.getLinearRegressionForecast(book, bookSellsByDays, createForecastRequest);
            forecast.setGlobalForecast(globalForecast);
            forecastsToSave.add(forecast);
        }
        if (createForecastRequest.getMethods().contains(ForecastMethod.AVERAGE)) {
            Forecast forecast = ForecastUtil.getAverageForecast(book, bookSellsByDays, createForecastRequest);
            forecast.setGlobalForecast(globalForecast);
            forecastsToSave.add(forecast);
        }

        forecastsToSave.forEach(forecast -> {
            try {
                forecastRepository.save(forecast);
            } catch (Exception e) {
                log.error("Error saving forecast: ", e);
            }
        });

        globalForecast.setForecasts(new HashSet<>(forecastsToSave));
        globalForecast.setCurrentAmount(book.getAmount());
        globalForecast.setPreviousSales(existingBookSells);
        globalForecast = globalForecastRepository.save(globalForecast);

        GlobalForecastResponse forecastResponse = modelMapper.map(globalForecast, GlobalForecastResponse.class);
        log.info(LogList.LOG_CREATE_FORECAST, forecastResponse.getId());
        forecastResponse.setForecastResponses(globalForecast.getForecasts()
                .stream()
                .map(forecast -> modelMapper.map(forecast, ForecastResponse.class))
                .toList());
        return forecastResponse;
    }

    @Override
    public void removeForecast(UUID id) {
        globalForecastRepository.delete(getOrThrow(id));
        log.info(LogList.LOG_DELETE_FORECAST, id);
    }

    private GlobalForecast getOrThrow(UUID id) {
        Optional<GlobalForecast> optionalSelling = globalForecastRepository.findById(id);
        return optionalSelling.orElseThrow(ForecastNotFoundException::new);
    }
}
