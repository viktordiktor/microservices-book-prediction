package com.nikanenka.services;

import com.nikanenka.dto.AuthorSellingResponse;
import com.nikanenka.dto.GenreSellingResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.dto.SellingRequest;
import com.nikanenka.dto.SellingResponse;
import com.nikanenka.models.feign.enums.Genre;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SellingService {
    PageResponse<SellingResponse> getAllSells(
            int pageNumber, int pageSize, String sortField, String sortType, String searchRequest);

    SellingResponse getSellById(UUID id);

    SellingResponse createSell(SellingRequest createSellRequest);

    SellingResponse editSell(UUID id, SellingRequest editSellRequest);

    void removeSell(UUID id);

    List<SellingResponse> getAllSellsByBookId(UUID bookId);

    List<SellingResponse> getDaySellsByBookIdAndDate(UUID bookId, LocalDate fromDate, LocalDate toDate);

    List<AuthorSellingResponse> getDaySellsByAuthorAndDate(String authorName, LocalDate fromDate, LocalDate toDate);

    List<GenreSellingResponse> getDaySellsByGenreAndDate(Genre genreName, LocalDate fromDate, LocalDate toDate);
}
