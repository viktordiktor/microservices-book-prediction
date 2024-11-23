package com.nikanenka.dto;

import com.nikanenka.models.ForecastMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForecastRequest {
    @NotNull
    private UUID bookId;
    @NotNull
    @Past
    private LocalDate fromDate;
    @NotNull
    @PastOrPresent
    private LocalDate toDate;
    @NotNull
    private List<ForecastMethod> methods;
    @NotNull
    private Integer daysNecessaryTo;
}
