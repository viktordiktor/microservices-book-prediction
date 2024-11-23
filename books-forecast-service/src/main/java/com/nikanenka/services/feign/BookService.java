package com.nikanenka.services.feign;

import com.nikanenka.dto.feign.BookResponse;

import java.util.UUID;

public interface BookService {
    BookResponse getBookById(UUID bookId);
}
