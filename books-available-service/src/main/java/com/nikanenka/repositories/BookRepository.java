package com.nikanenka.repositories;

import com.nikanenka.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {
    boolean existsByIsbn(String isbn);
    Optional<Book> findBookByIsbn(String isbn);
    List<Book> findBooksByAuthor(String author);
    List<Book> findBooksByGenre(String genre);
    List<Book> findBooksByTitle(String title);
    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchRequest, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchRequest, '%')) OR " +
            "LOWER(b.genre) LIKE LOWER(CONCAT('%', :searchRequest, '%')) OR " +
            "LOWER(b.pages) LIKE LOWER(CONCAT('%', :searchRequest, '%')) OR " +
            "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :searchRequest, '%')) OR " +
            "CAST(b.publicationYear AS string) LIKE CONCAT('%', :searchRequest, '%')")
    Page<Book> searchByFields(@Param("searchRequest") String searchRequest, Pageable pageable);
}
