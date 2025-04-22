package com.nikanenka.repositories;

import com.nikanenka.models.Forecast;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ForecastRepository extends JpaRepository<Forecast, UUID> {
    Optional<Forecast> findByBookId(UUID bookId);
}
