package com.nikanenka.services.impl;

import com.nikanenka.dto.AuthorSellingResponse;
import com.nikanenka.dto.GenreSellingResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.SellingRequest;
import com.nikanenka.dto.SellingResponse;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.BookSellRequest;
import com.nikanenka.exceptions.InvalidDateException;
import com.nikanenka.exceptions.NotEnoughBookException;
import com.nikanenka.exceptions.SellNotFoundException;
import com.nikanenka.models.Selling;
import com.nikanenka.models.feign.enums.Genre;
import com.nikanenka.repositories.SellingRepository;
import com.nikanenka.services.SellingService;
import com.nikanenka.services.feign.BookService;
import com.nikanenka.utils.LogList;
import com.nikanenka.utils.PageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellingServiceImpl implements SellingService {
    private final SellingRepository sellingRepository;
    private final BookService bookService;
    private final ModelMapper modelMapper;

    @Override
    public PageResponse<SellingResponse> getAllSells(
            int pageNumber, int pageSize, String sortField, String sortType, String searchRequest) {
        Pageable pageable = PageUtil
                .createPageable(pageNumber, pageSize, sortField, sortType, SellingResponse.class);

        Page<Selling> page;
        if (searchRequest != null && !searchRequest.trim().isEmpty()) {
            page = sellingRepository.searchByFields(searchRequest, pageable);
        } else {
            page = sellingRepository.findAll(pageable);
        }

        List<SellingResponse> sells = page.getContent().stream()
                .map(sell -> modelMapper.map(sell, SellingResponse.class))
                .toList();

        return PageResponse.<SellingResponse>builder()
                .objectList(sells)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Override
    public SellingResponse getSellById(UUID id) {
        Selling sell = getOrThrow(id);
        log.info(LogList.LOG_GET_SELLING, id);
        return modelMapper.map(sell, SellingResponse.class);
    }

    @Override
    public SellingResponse createSell(SellingRequest createSellRequest) {
        UUID bookId = createSellRequest.getBookId();
        if (bookService.getBookById(bookId).getAmount() < createSellRequest.getAmount()) {
            throw new NotEnoughBookException();
        }
        bookService.sellBook(BookSellRequest.builder()
                .bookId(createSellRequest.getBookId())
                .amount(createSellRequest.getAmount())
                .build());
        Selling savedSelling =
                sellingRepository.save(modelMapper.map(createSellRequest, Selling.class));
        log.info(LogList.LOG_CREATE_SELLING, savedSelling.getId());
        return modelMapper.map(savedSelling, SellingResponse.class);
    }

    @Override
    public SellingResponse editSell(UUID id, SellingRequest editSellRequest) {
        Integer existingSellingAmount = getOrThrow(id).getAmount();

        UUID bookId = editSellRequest.getBookId();
        if (bookService.getBookById(bookId).getAmount() + existingSellingAmount
                < editSellRequest.getAmount()) {
            throw new NotEnoughBookException();
        }

        Selling editingSell = modelMapper.map(editSellRequest, Selling.class);
        editingSell.setId(id);

        bookService.sellBook(BookSellRequest.builder()
                .bookId(editSellRequest.getBookId())
                .amount(editSellRequest.getAmount() - existingSellingAmount)
                .build());
        sellingRepository.save(editingSell);
        log.info(LogList.LOG_EDIT_SELLING, id);
        return modelMapper.map(editingSell, SellingResponse.class);
    }

    @Override
    public void removeSell(UUID id) {
        sellingRepository.delete(getOrThrow(id));
        log.info(LogList.LOG_DELETE_SELLING, id);
    }

    @Override
    public List<SellingResponse> getAllSellsByBookId(UUID bookId) {
        return sellingRepository.findSellingsByBookId(bookId)
                .stream()
                .map(selling -> modelMapper.map(selling, SellingResponse.class))
                .toList();
    }

    @Override
    public List<SellingResponse> getDaySellsByBookIdAndDate(UUID bookId, LocalDate fromDate, LocalDate toDate) {
        Map<LocalDate, Integer> dailySales = sellingRepository.findSellingsByBookId(bookId)
                .stream()
                .filter(selling -> isWithinDateRange(selling.getDate(), fromDate, toDate))
                .collect(Collectors.groupingBy(
                        Selling::getDate,
                        Collectors.summingInt(Selling::getAmount)
                ));

        List<SellingResponse> responses = new ArrayList<>();

        for (LocalDate date = fromDate; !date.isAfter(toDate); date = date.plusDays(1)) {
            Integer amount = dailySales.getOrDefault(date, 0);
            responses.add(SellingResponse.builder()
                    .date(date)
                    .amount(amount)
                    .bookId(bookId)
                    .build());
        }

        return responses;
    }

    @Override
    public List<AuthorSellingResponse> getDaySellsByAuthorAndDate(
            String authorName, LocalDate fromDate, LocalDate toDate) {
        List<BookResponse> booksByAuthor = bookService.getBooksByAuthor(authorName);

        List<Selling> sellsByAuthor = new ArrayList<>();

        booksByAuthor.forEach(book ->
                sellsByAuthor.addAll(sellingRepository.findSellingsByBookId(book.getId())));

        Map<LocalDate, Integer> dailySales = sellsByAuthor
                .stream()
                .filter(selling -> isWithinDateRange(selling.getDate(), fromDate, toDate))
                .collect(Collectors.groupingBy(
                        Selling::getDate,
                        Collectors.summingInt(Selling::getAmount)
                ));

        List<AuthorSellingResponse> responses = new ArrayList<>();

        for (LocalDate date = fromDate; !date.isAfter(toDate); date = date.plusDays(1)) {
            Integer amount = dailySales.getOrDefault(date, 0);
            responses.add(AuthorSellingResponse.builder()
                    .date(date)
                    .amount(amount)
                    .author(authorName)
                    .build());
        }

        return responses;
    }

    @Override
    public List<GenreSellingResponse> getDaySellsByGenreAndDate(
            Genre genre, LocalDate fromDate, LocalDate toDate) {
        List<BookResponse> booksByGenre = bookService.getBooksByGenre(genre.toString());

        List<Selling> sellsByGenre = new ArrayList<>();

        booksByGenre.forEach(book ->
                sellsByGenre.addAll(sellingRepository.findSellingsByBookId(book.getId())));

        Map<LocalDate, Integer> dailySales = sellsByGenre
                .stream()
                .filter(selling -> isWithinDateRange(selling.getDate(), fromDate, toDate))
                .collect(Collectors.groupingBy(
                        Selling::getDate,
                        Collectors.summingInt(Selling::getAmount)
                ));

        List<GenreSellingResponse> responses = new ArrayList<>();

        for (LocalDate date = fromDate; !date.isAfter(toDate); date = date.plusDays(1)) {
            Integer amount = dailySales.getOrDefault(date, 0);
            responses.add(GenreSellingResponse.builder()
                    .date(date)
                    .amount(amount)
                    .genre(genre)
                    .build());
        }

        return responses;
    }

    private boolean isWithinDateRange(LocalDate sellingDate, LocalDate fromDate, LocalDate toDate) {
        if (fromDate.isAfter(toDate)) {
            throw new InvalidDateException("fromDate can't be after toDate");
        }

        return !sellingDate.isBefore(fromDate) && !sellingDate.isAfter(toDate);
    }

    private Selling getOrThrow(UUID id) {
        Optional<Selling> optionalSelling = sellingRepository.findById(id);
        return optionalSelling.orElseThrow(SellNotFoundException::new);
    }
}
