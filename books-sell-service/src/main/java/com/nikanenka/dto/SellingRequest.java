package com.nikanenka.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellingRequest {
    @NotNull
    private Integer amount;
    @NotNull
    @PastOrPresent
    private LocalDate date;
    @NotNull
    private UUID bookId;
}
