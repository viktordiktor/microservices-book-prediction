package com.nikanenka.repositories;

import com.nikanenka.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {
    void removeImagesByBookId(UUID bookId);
}
