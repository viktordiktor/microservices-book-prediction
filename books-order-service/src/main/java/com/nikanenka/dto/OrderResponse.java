package com.nikanenka.dto;

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
public class OrderResponse {
    private UUID id;
    private UUID bookId;
    private String bookTitle;
    private Integer amount;
    private Integer orderLeadTime;
    private Boolean completed;
    private LocalDate createdDate;
    private LocalDate completeDate;
}
