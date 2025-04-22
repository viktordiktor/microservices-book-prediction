package com.nikanenka.controllers;

import com.nikanenka.dto.BookChangeAmountRequest;
import com.nikanenka.dto.BookRequest;
import com.nikanenka.dto.BookResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.feign.OrderRequiredResponse;
import com.nikanenka.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import java.io.IOException;
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

    @GetMapping("/forecast/{id}")
    public OrderRequiredResponse getOrderRequiredByBookId(@PathVariable UUID id) {
        return bookService.getOrderRequiredByBookId(id);
    }

    @GetMapping("/forecast/all")
    public PageResponse<OrderRequiredResponse> getOrderRequiredCharacteristics(
                                    @RequestParam(defaultValue = "0") int pageNumber,
                                    @RequestParam(defaultValue = "10") int pageSize,
                                    @RequestParam(defaultValue = "id") String sortField,
                                    @RequestParam(defaultValue = "asc") String sortType) {
        return bookService.getOrderRequiredCharacteristics(pageNumber, pageSize, sortField, sortType);
    }

    @GetMapping("/forecast/excel-export")
    public ResponseEntity<Resource> getExcelAllForecasts() throws IOException {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=generated_forecasts.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bookService.getExcelAllForecasts());
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
    public BookResponse sellBook(@RequestBody BookChangeAmountRequest bookChangeAmountRequest) {
        return bookService.sellBook(bookChangeAmountRequest);
    }

    @PostMapping("/order")
    public BookResponse orderBook(@RequestBody BookChangeAmountRequest bookChangeAmountRequest) {
        return bookService.orderBook(bookChangeAmountRequest);
    }
}
