package com.nikanenka.dto;

import com.nikanenka.models.enums.Genre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {
    private UUID id;
    private String title;
    private String author;
    private Genre genre;
    private String pages;
    private String isbn;
    private Integer publicationYear;
    private Integer amount;
    private BigDecimal price;
    private String imageLink;
    private List<String> additionalImagesLinks;
}
