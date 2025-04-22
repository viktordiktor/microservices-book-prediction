package com.nikanenka.services;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.ForecastResponse;
import com.nikanenka.dto.PageResponse;
import org.springframework.core.io.Resource;

import java.util.UUID;

public interface ForecastService {
    PageResponse<ForecastResponse> getAllForecasts(
            int pageNumber, int pageSize, String sortField, String sortType);

    Resource getExcelAllForecasts();

    ForecastResponse getForecastById(UUID id);

    ForecastResponse getForecastByBookId(UUID bookId);

    ForecastResponse createForecast(ForecastRequest createForecastRequest);

    void removeForecast(UUID id);
}
