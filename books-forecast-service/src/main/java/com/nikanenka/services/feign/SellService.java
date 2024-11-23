package com.nikanenka.services.feign;

import com.nikanenka.dto.feign.SellingResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SellService {
    List<SellingResponse> getDaySellsByBookIdAndDate(UUID bookId, LocalDate fromDate, LocalDate toDate);
}
