package com.nikanenka.controllers;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.ForecastResponse;
import com.nikanenka.dto.PageResponse;
import com.nikanenka.services.ForecastService;
import com.nikanenka.services.PromptService;
import com.nikanenka.utils.ExcelUtil;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/forecast")
public class ForecastController {
    private final ForecastService forecastService;
    private final PromptService promptService;

    @GetMapping("/generate")
    public String generate(@RequestParam String promptMessage) {
        return promptService.generate(promptMessage);
    }

    @GetMapping
    public PageResponse<ForecastResponse> getAllForecasts(@RequestParam(defaultValue = "0") int pageNumber,
                                                          @RequestParam(defaultValue = "50") int pageSize,
                                                          @RequestParam(defaultValue = "id") String sortField,
                                                          @RequestParam(defaultValue = "asc") String sortType) {
        return forecastService.getAllForecasts(pageNumber, pageSize, sortField, sortType);
    }

    @GetMapping("/excel-export")
    public ResponseEntity<Resource> getExcelAllForecasts() throws IOException {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=generated_forecasts.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(forecastService.getExcelAllForecasts());
    }

    @GetMapping("/{id}")
    public ForecastResponse getForecastById(@PathVariable UUID id) {
        return forecastService.getForecastById(id);
    }

    @GetMapping("/book/{bookId}")
    public ForecastResponse getForecastByBookId(@PathVariable UUID bookId) {
        return forecastService.getForecastByBookId(bookId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ForecastResponse createForecast(@Valid @RequestBody ForecastRequest createForecastRequest) {
        return forecastService.createForecast(createForecastRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeForecast(@PathVariable UUID id) {
        forecastService.removeForecast(id);
    }
}
