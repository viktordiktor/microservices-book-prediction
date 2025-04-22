package com.nikanenka.feign;

import com.nikanenka.config.feign.FeignConfig;
import com.nikanenka.dto.feign.BookOrderRequest;
import com.nikanenka.dto.feign.BookResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(value = "${feign.client.config.books.name}",
        configuration = FeignConfig.class,
        path = "${feign.client.config.books.path}")
public interface BookFeignClient {
    @GetMapping("/{bookId}")
    BookResponse getBookById(@PathVariable UUID bookId);

    @PostMapping("/order")
    BookResponse sellBook(@RequestBody BookOrderRequest bookOrderRequest);
}
