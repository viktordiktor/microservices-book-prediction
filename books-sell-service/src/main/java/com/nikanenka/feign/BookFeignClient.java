package com.nikanenka.feign;

import com.nikanenka.config.feign.FeignConfig;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.BookSellRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@FeignClient(value = "${feign.client.config.books.name}",
        configuration = FeignConfig.class,
        path = "${feign.client.config.books.path}")
public interface BookFeignClient {
    @GetMapping("/{bookId}")
    BookResponse getBookById(@PathVariable UUID bookId);

    @PostMapping("/sell")
    BookResponse sellBook(@RequestBody BookSellRequest bookSellRequest);

    @GetMapping("/author/{authorName}")
    List<BookResponse> getBooksByAuthor(@PathVariable String authorName);

    @GetMapping("/genre/{genreName}")
    List<BookResponse> getBooksByGenre(@PathVariable String genreName);
}
