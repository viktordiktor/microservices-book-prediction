package com.nikanenka.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "sells")
public class Selling {
    @Id
    @UuidGenerator
    @Column(name="id")
    private UUID id;
    @Column(name="amount")
    private Integer amount;
    @Column(name="sell_date")
    private LocalDate date;
    @Column(name="book_id")
    private UUID bookId;
}
