package com.nikanenka.repositories;

import com.nikanenka.models.Forecast;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ForecastRepository extends JpaRepository<Forecast, UUID> {
    @Query("SELECT f FROM Forecast f WHERE " +
            "CAST(f.id AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.method AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.summaryRoundedForecast AS string) LIKE CONCAT('%', :searchRequest, '%') OR " +
            "CAST(f.summaryForecast AS string) LIKE CONCAT('%', :searchRequest, '%')")
    Page<Forecast> searchByFields(@Param("searchRequest") String searchRequest, Pageable pageable);
}
