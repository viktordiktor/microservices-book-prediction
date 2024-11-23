package com.nikanenka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.TreeMap;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GlobalForecastResponse {
    private UUID id;
    private UUID bookId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer daysNecessaryTo;
    private Integer currentAmount;
    private TreeMap<LocalDate, Integer> previousSales;
    private List<ForecastResponse> forecastResponses;
}
