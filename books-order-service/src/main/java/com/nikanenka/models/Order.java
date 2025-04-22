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
@Table(name = "orders")
public class Order {
    @Id
    @UuidGenerator
    @Column(name="id")
    private UUID id;
    @Column(name="book_id")
    private UUID bookId;
    @Column(name="amount")
    private Integer amount;
    @Column(name="order_lead_time")
    private Integer orderLeadTime;
    @Column(name="completed")
    private Boolean completed;
    @Column(name="created_date")
    private LocalDate createdDate;
    @Column(name="complete_date")
    private LocalDate completeDate;
}
