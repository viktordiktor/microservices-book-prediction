package com.nikanenka.dto;

import com.nikanenka.models.ForecastMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.TreeMap;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForecastResponse {
    private UUID id;
    private ForecastMethod method;
    private TreeMap<LocalDate, Double> dayForecast;
    private Double summaryForecast;
    private Integer summaryRoundedForecast;
}
