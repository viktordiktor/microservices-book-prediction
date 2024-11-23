package com.nikanenka.services.impl;

import com.nikanenka.exceptions.ImageNotFoundException;
import com.nikanenka.models.Image;
import com.nikanenka.repositories.ImageRepository;
import com.nikanenka.services.ImageService;
import com.nikanenka.utils.ImgurUploader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ImgurUploader imgurUploader;

    @Override
    public Image saveImageToDatabase(UUID bookId, MultipartFile image) {
        return imageRepository.save(Image.builder()
                        .bookId(bookId)
                        .link(uploadAndGetImgurUrl(image))
                .build());
    }

    @Override
    public Set<Image> saveAdditionalImagesToDatabase(UUID bookId, MultipartFile[] additionalImages) {
        return Arrays.stream(additionalImages)
                .map(image -> saveImageToDatabase(bookId, image))
                .collect(Collectors.toSet());
    }

    @Override
    public String uploadAndGetImgurUrl(MultipartFile image) {
        try {
            return imgurUploader.getImgurUrl(image);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void removeImagesByBookId(UUID bookId) {
        imageRepository.removeImagesByBookId(bookId);
    }

    @Override
    public Set<Image> saveAdditionalImagesByLinks(UUID bookId, List<String> links) {
        Set<Image> imageSet = new HashSet<>();
        for (String link : links) {
            imageSet.add(imageRepository.save(Image.builder()
                    .bookId(bookId)
                    .link(link)
                    .build()));
        }
        return imageSet;
    }

    private Image getOrThrow(UUID id) {
        Optional<Image> optionalBook = imageRepository.findById(id);
        return optionalBook.orElseThrow(ImageNotFoundException::new);
    }
}
