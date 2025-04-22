package com.nikanenka.services.feign.impl;

import com.nikanenka.feign.ForecastFeignClient;
import com.nikanenka.models.feign.ForecastResponse;
import com.nikanenka.services.feign.ForecastService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@CircuitBreaker(name = "forecastBreaker", fallbackMethod = "fallbackForecastService")
@Retry(name = "forecastRetry")
@Slf4j
public class ForecastServiceImpl implements ForecastService {
    private final ForecastFeignClient forecastFeignClient;

    @Override
    public ForecastResponse getForecastByBookId(UUID bookId) {
        return forecastFeignClient.getForecastByBookId(bookId);
    }

    public ForecastResponse fallbackForecastService(UUID bookId, Exception ex) {
        log.error(ex.getMessage());
        return ForecastResponse.builder()
                .errorMessage(ex.getMessage())
                .build();
    }
}
