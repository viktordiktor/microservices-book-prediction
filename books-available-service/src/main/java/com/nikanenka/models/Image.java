package com.nikanenka.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "images")
public class Image {
    @Id
    @UuidGenerator
    @Column(name="id")
    private UUID id;
    @Column(name="link")
    private String link;
    @Column(name = "book_id")
    private UUID bookId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    private Book book;
}
