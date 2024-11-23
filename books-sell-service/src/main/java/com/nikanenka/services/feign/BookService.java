package com.nikanenka.services.feign;

import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.BookSellRequest;

import java.util.List;
import java.util.UUID;

public interface BookService {
    BookResponse getBookById(UUID bookId);
    BookResponse sellBook(BookSellRequest bookSellRequest);
    List<BookResponse> getBooksByAuthor(String authorName);
    List<BookResponse> getBooksByGenre(String genreName);
}
