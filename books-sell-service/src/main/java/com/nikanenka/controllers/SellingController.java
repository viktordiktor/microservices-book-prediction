package com.nikanenka.controllers;

import com.nikanenka.dto.AuthorSellingResponse;
import com.nikanenka.dto.GenreSellingResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.SellingRequest;
import com.nikanenka.dto.SellingResponse;
import com.nikanenka.models.feign.enums.Genre;
import com.nikanenka.services.SellingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sells")
public class SellingController {
    private final SellingService sellingService;

    @GetMapping
    public PageResponse<SellingResponse> getAllSells(@RequestParam(defaultValue = "0") int pageNumber,
                                                     @RequestParam(defaultValue = "50") int pageSize,
                                                     @RequestParam(defaultValue = "id") String sortField,
                                                     @RequestParam(defaultValue = "asc") String sortType,
                                                     @RequestParam(required = false) String searchRequest) {
        return sellingService.getAllSells(pageNumber, pageSize, sortField, sortType, searchRequest);
    }

    @GetMapping("/book/{bookId}")
    public List<SellingResponse> getAllSellsByBookId(
            @PathVariable UUID bookId) {
        return sellingService.getAllSellsByBookId(bookId);
    }

    @GetMapping("/book/days/{bookId}")
    public List<SellingResponse> getDaySellsByBookIdAndDate(
            @PathVariable UUID bookId,
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {
        return sellingService.getDaySellsByBookIdAndDate(bookId, fromDate, toDate);
    }

    @GetMapping("/author/{authorName}")
    public List<AuthorSellingResponse> getDaySellsByAuthorAndDate(
            @PathVariable String authorName,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate) {
        return sellingService.getDaySellsByAuthorAndDate(authorName, fromDate, toDate);
    }

    @GetMapping("/genre/{genreName}")
    public List<GenreSellingResponse> getDaySellsByGenreAndDate(
            @PathVariable Genre genreName,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate) {
        return sellingService.getDaySellsByGenreAndDate(genreName, fromDate, toDate);
    }

    @GetMapping("/{id}")
    public SellingResponse getSellById(@PathVariable UUID id) {
        return sellingService.getSellById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SellingResponse createSell(@Valid @RequestBody SellingRequest createSellRequest) {
        return sellingService.createSell(createSellRequest);
    }

    @PutMapping(path = "/{id}")
    public SellingResponse editSell(@PathVariable UUID id, @Valid @RequestBody SellingRequest editSellRequest) {
        return sellingService.editSell(id, editSellRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSell(@PathVariable UUID id) {
        sellingService.removeSell(id);
    }
}
