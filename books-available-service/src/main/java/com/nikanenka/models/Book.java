package com.nikanenka.models;

import com.nikanenka.models.enums.Genre;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "books")
public class Book {
    @Id
    @UuidGenerator
    @Column(name="id")
    private UUID id;
    @Column(name="title")
    private String title;
    @Column(name="author")
    private String author;
    @Column(name="genre")
    @Enumerated(EnumType.STRING)
    private Genre genre;
    @Column(name="pages")
    private String pages;
    @Column(name="isbn")
    private String isbn;
    @Column(name="publication_year")
    private Integer publicationYear;
    @Column(name="image")
    private String imageLink;
    @Column(name="amount")
    private Integer amount;
    @Column(name="price")
    private BigDecimal price;
    @OneToMany(mappedBy="book")
    private Set<Image> additionalImages;
}
