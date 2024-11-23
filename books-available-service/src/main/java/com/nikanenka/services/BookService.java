package com.nikanenka.services;

import com.nikanenka.dto.BookRequest;
import com.nikanenka.dto.BookResponse;
import com.nikanenka.dto.BookSellRequest;
import com.nikanenka.dto.PageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface BookService {
    PageResponse<BookResponse> getAllBooks
            (int pageNumber, int pageSize, String sortField, String sortType, String searchRequest);

    BookResponse getBookById(UUID id);

    BookResponse createBook(BookRequest createBookRequest, MultipartFile image, MultipartFile[] additionalImages);

    void removeBook(UUID id);

    BookResponse editBook(UUID id, BookRequest editBookRequest, MultipartFile image, MultipartFile[] additionalImages);

    BookResponse sellBook(BookSellRequest bookSellRequest);

    List<BookResponse> getBooksByAuthor(String authorName);

    List<BookResponse> getBooksByGenre(String genreName);
}
