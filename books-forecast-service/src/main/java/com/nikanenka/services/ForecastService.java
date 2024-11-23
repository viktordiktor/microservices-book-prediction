package com.nikanenka.services;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.GlobalForecastResponse;
import com.nikanenka.dto.PageResponse;

import java.util.UUID;

public interface ForecastService {
    PageResponse<GlobalForecastResponse> getAllForecasts(
            int pageNumber, int pageSize, String sortField, String sortType, String searchRequest);

    GlobalForecastResponse getForecastById(UUID id);

    GlobalForecastResponse createForecast(ForecastRequest createForecastRequest);

    void removeForecast(UUID id);
}
