package com.nikanenka.repositories;

import com.nikanenka.models.Selling;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SellingRepository extends JpaRepository<Selling, UUID> {
    @Query("SELECT s FROM Selling s WHERE " +
            "CAST(s.id AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(s.date AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(s.amount AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(s.amount AS string) LIKE CONCAT('%', :searchRequest, '%')")
    Page<Selling> searchByFields(@Param("searchRequest") String searchRequest, Pageable pageable);

    List<Selling> findSellingsByBookId(UUID bookId);
}
