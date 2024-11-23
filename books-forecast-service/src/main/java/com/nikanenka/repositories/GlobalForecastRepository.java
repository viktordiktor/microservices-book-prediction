package com.nikanenka.repositories;

import com.nikanenka.models.GlobalForecast;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface GlobalForecastRepository extends JpaRepository<GlobalForecast, UUID> {
    @Query("SELECT f FROM GlobalForecast f WHERE " +
            "CAST(f.id AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.bookId AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.daysNecessaryTo AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.fromDate AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.toDate AS string) LIKE CONCAT('%', :searchRequest, '%')")
    Page<GlobalForecast> searchByFields(@Param("searchRequest") String searchRequest, Pageable pageable);
}
