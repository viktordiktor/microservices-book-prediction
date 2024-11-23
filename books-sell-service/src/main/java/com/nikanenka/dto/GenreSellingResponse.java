package com.nikanenka.dto;

import com.nikanenka.models.feign.enums.Genre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenreSellingResponse {
    private Integer amount;
    private LocalDate date;
    private Genre genre;
}