package com.nikanenka.services.feign.impl;

import com.nikanenka.dto.feign.BookOrderRequest;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.feign.BookFeignClient;
import com.nikanenka.services.feign.BookService;
import com.nikanenka.utils.LogList;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@CircuitBreaker(name = "availableBooksBreaker", fallbackMethod = "fallbackAvailableBooksService")
@Retry(name = "availableBooksRetry")
@Slf4j
public class BookServiceImpl implements BookService {
    private final BookFeignClient bookFeignClient;

    @Override
    public BookResponse getBookById(UUID bookId) {
        return bookFeignClient.getBookById(bookId);
    }

    @Override
    public BookResponse orderBook(BookOrderRequest bookOrderRequest) {
        return bookFeignClient.sellBook(bookOrderRequest);
    }

    public BookResponse fallbackAvailableBooksService(UUID bookId, Exception ex) {
        log.error(LogList.LOG_FEIGN_BOOK_AVAILABLE_SERVICE_ERROR, bookId, ex.getMessage());
        return BookResponse.builder()
                .errorMessage(ex.getMessage())
                .build();
    }

    public BookResponse fallbackAvailableBooksService(BookOrderRequest bookSellRequest, Exception ex) {
        log.error(LogList.LOG_FEIGN_BOOK_AVAILABLE_SERVICE_ERROR, bookSellRequest.getBookId(), ex.getMessage());
        return BookResponse.builder()
                .errorMessage(ex.getMessage())
                .build();
    }

    public List<BookResponse> fallbackAvailableBooksService(String variable, Exception ex) {
        log.error(LogList.LOG_FEIGN_BOOK_AVAILABLE_SERVICE_ERROR, variable, ex.getMessage());
        return Collections.singletonList(BookResponse.builder()
                .errorMessage(ex.getMessage())
                .build());
    }
}
