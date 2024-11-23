package com.nikanenka.services;

import com.nikanenka.models.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface ImageService {
    Set<Image> saveAdditionalImagesToDatabase(UUID bookId, MultipartFile[] additionalImages);
    Image saveImageToDatabase(UUID bookId, MultipartFile image);
    String uploadAndGetImgurUrl(MultipartFile image);
    void removeImagesByBookId(UUID bookId);
    Set<Image> saveAdditionalImagesByLinks(UUID bookId, List<String> links);
}
