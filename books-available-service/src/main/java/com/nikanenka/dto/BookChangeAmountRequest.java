package com.nikanenka.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookChangeAmountRequest {
    @NotNull
    private UUID bookId;
    @NotNull
    private Integer amount;
}
