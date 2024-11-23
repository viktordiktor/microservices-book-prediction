package com.nikanenka.services.feign.impl;

import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.SellingResponse;
import com.nikanenka.feign.SellFeignClient;
import com.nikanenka.services.feign.SellService;
import com.nikanenka.utils.LogList;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@CircuitBreaker(name = "sellBooksBreaker", fallbackMethod = "fallbackSellBooksService")
@Retry(name = "sellBooksRetry")
@Slf4j
public class SellServiceImpl implements SellService {
    private final SellFeignClient sellFeignClient;

    @Override
    public List<SellingResponse> getDaySellsByBookIdAndDate(UUID bookId, LocalDate fromDate, LocalDate toDate) {
        return sellFeignClient.getDaySellsByBookIdAndDate(bookId, fromDate, toDate);
    }

    public BookResponse fallbackSellBooksService(UUID bookId, LocalDate fromDate, LocalDate toDate, Exception ex) {
        log.error(LogList.LOG_FEIGN_BOOK_SELL_SERVICE_ERROR, bookId, ex.getMessage());
        return BookResponse.builder()
                .errorMessage(ex.getMessage())
                .build();
    }
}
