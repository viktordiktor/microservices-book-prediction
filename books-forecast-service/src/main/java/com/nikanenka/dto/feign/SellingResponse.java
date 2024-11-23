package com.nikanenka.dto.feign;

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
public class SellingResponse {
    private UUID id;
    private Integer amount;
    private LocalDate date;
    private UUID bookId;
}
