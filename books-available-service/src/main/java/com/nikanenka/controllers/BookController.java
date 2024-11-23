package com.nikanenka.controllers;

import com.nikanenka.dto.BookRequest;
import com.nikanenka.dto.BookResponse;
import com.nikanenka.dto.BookSellRequest;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/books")
public class BookController {
    private final BookService bookService;

    @GetMapping
    public PageResponse<BookResponse> getAllBooks(@RequestParam(defaultValue = "0") int pageNumber,
                                                  @RequestParam(defaultValue = "5") int pageSize,
                                                  @RequestParam(defaultValue = "id") String sortField,
                                                  @RequestParam(defaultValue = "asc") String sortType,
                                                  @RequestParam(required = false) String searchRequest) {
        return bookService.getAllBooks(pageNumber, pageSize, sortField, sortType, searchRequest);
    }

    @GetMapping("/{id}")
    public BookResponse getBookById(@PathVariable UUID id) {
        return bookService.getBookById(id);
    }

    @GetMapping("/author/{authorName}")
    public List<BookResponse> getBooksByAuthor(@PathVariable String authorName) {
        return bookService.getBooksByAuthor(authorName);
    }

    @GetMapping("/genre/{genreName}")
    public List<BookResponse> getBooksByGenre(@PathVariable String genreName) {
        return bookService.getBooksByGenre(genreName);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse createBook(@Valid @RequestPart BookRequest createBookRequest,
                                   @RequestPart MultipartFile image,
                                   @RequestPart(required = false) MultipartFile[] additionalImages) {
        return bookService.createBook(createBookRequest, image, additionalImages);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookResponse editBook(@PathVariable UUID id,
                                 @Valid @RequestPart BookRequest editBookRequest,
                                 @RequestPart(required = false) MultipartFile image,
                                 @RequestPart(required = false) MultipartFile[] additionalImages) {
        return bookService.editBook(id, editBookRequest, image, additionalImages);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeBook(@PathVariable UUID id) {
        bookService.removeBook(id);
    }

    @PostMapping("/sell")
    public BookResponse sellBook(@RequestBody BookSellRequest bookSellRequest) {
        return bookService.sellBook(bookSellRequest);
    }
}
