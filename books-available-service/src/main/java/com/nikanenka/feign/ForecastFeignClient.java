package com.nikanenka.feign;

import com.nikanenka.config.feign.FeignConfig;
import com.nikanenka.models.feign.ForecastResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(value = "${feign.client.config.forecasts.name}",
        configuration = FeignConfig.class,
        path = "${feign.client.config.forecasts.path}")
public interface ForecastFeignClient {
    @GetMapping("/book/{bookId}")
    ForecastResponse getForecastByBookId(@PathVariable UUID bookId);
}
