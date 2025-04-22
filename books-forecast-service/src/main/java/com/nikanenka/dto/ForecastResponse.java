package com.nikanenka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForecastResponse {
    private UUID id;
    private UUID bookId;
    private String bookTitle;
    private Integer insuranceDays;
    private Integer orderLeadTime;
    private BigDecimal orderPlacementCost;
    private BigDecimal storageCostPerUnit;
    private Double insuranceStock;
    private Integer roundedInsuranceStock;
    private Double orderPoint;
    private Integer roundedOrderPoint;
    private Double optimalBatchSize;
    private Integer roundedOptimalBatchSize;
    private Map<LocalDate, Integer> previousSales;
}
