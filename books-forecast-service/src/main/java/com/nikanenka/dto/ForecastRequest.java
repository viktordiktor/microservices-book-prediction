package com.nikanenka.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForecastRequest {
    @NotNull
    private UUID bookId;
    @NotNull
    private Integer insuranceDays;
    @NotNull
    private Integer orderLeadTime;
    @NotNull
    private BigDecimal orderPlacementCost;
    @NotNull
    private BigDecimal storageCostPerUnit;
}
