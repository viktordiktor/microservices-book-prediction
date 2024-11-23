package com.nikanenka.dto;

import com.nikanenka.models.enums.Genre;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    @NotNull
    private Genre genre;

    @NotNull
    @Digits(integer = 4, fraction = 0)
    private Integer pages;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10,13}$")
    private String isbn;

    @NotNull
    @Min(1900)
    @Max(2100)
    private Integer publicationYear;

    @NotNull
    private Integer amount;

    @NotNull
    private BigDecimal price;

    private String imageLink;

    private List<String> additionalImagesLinks;
}
