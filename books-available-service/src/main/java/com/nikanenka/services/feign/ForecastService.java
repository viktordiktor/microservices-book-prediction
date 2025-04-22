package com.nikanenka.services.feign;

import com.nikanenka.models.feign.ForecastResponse;

import java.util.UUID;

public interface ForecastService {
    ForecastResponse getForecastByBookId(UUID bookId);
}
