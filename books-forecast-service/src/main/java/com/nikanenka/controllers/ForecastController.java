package com.nikanenka.controllers;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.GlobalForecastResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.services.ForecastService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/forecast")
public class ForecastController {
    private final ForecastService forecastService;

    @GetMapping
    public PageResponse<GlobalForecastResponse> getAllForecasts(@RequestParam(defaultValue = "0") int pageNumber,
                                                          @RequestParam(defaultValue = "50") int pageSize,
                                                          @RequestParam(defaultValue = "id") String sortField,
                                                          @RequestParam(defaultValue = "asc") String sortType,
                                                          @RequestParam(required = false) String searchRequest) {
        return forecastService.getAllForecasts(pageNumber, pageSize, sortField, sortType, searchRequest);
    }

//    @GetMapping("/{bookId}")
//    public List<ForecastResponse> getAllForecastsByBookId(
//            @PathVariable UUID bookId,
//            @RequestParam(required = false) LocalDate fromDate,
//            @RequestParam(required = false) LocalDate toDate) {
//        return forecastService.getAllForecastsByBookId(bookId, fromDate, toDate);
//    }

    @GetMapping("/{id}")
    public GlobalForecastResponse getForecastById(@PathVariable UUID id) {
        return forecastService.getForecastById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GlobalForecastResponse createForecast(@Valid @RequestBody ForecastRequest createForecastRequest) {
        return forecastService.createForecast(createForecastRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeForecast(@PathVariable UUID id) {
        forecastService.removeForecast(id);
    }
}
