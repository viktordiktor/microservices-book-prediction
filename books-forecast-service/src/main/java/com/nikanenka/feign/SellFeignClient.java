package com.nikanenka.feign;

import com.nikanenka.config.feign.FeignConfig;
import com.nikanenka.dto.feign.SellingResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@FeignClient(value = "${feign.client.config.sell.name}",
        configuration = FeignConfig.class,
        path = "${feign.client.config.sell.path}")
public interface SellFeignClient {
    @GetMapping("/book/days/{bookId}")
    List<SellingResponse> getDaySellsByBookIdAndDate(
            @PathVariable UUID bookId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate);
}
