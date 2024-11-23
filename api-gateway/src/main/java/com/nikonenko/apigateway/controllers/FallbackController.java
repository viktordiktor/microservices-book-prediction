package com.nikonenko.apigateway.controllers;

import com.nikonenko.apigateway.utils.ExceptionList;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fallback")
public class FallbackController {
    @RequestMapping(value = "/books-available-service",
            method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
    @ResponseStatus(HttpStatus.GATEWAY_TIMEOUT)
    public String booksAvailableServiceFallback() {
        return ExceptionList.BOOKS_AVAILABLE_SERVICE_DOWN.getValue();
    }

    @RequestMapping(value = "/books-sell-service",
            method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
    @ResponseStatus(HttpStatus.GATEWAY_TIMEOUT)
    public String booksSellServiceFallback() {
        return ExceptionList.BOOKS_SELL_SERVICE_DOWN.getValue();
    }

    @RequestMapping(value = "/books-forecast-service",
            method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE})
    @ResponseStatus(HttpStatus.GATEWAY_TIMEOUT)
    public String booksForecastServiceFallback() {
        return ExceptionList.BOOKS_FORECAST_SERVICE_DOWN.getValue();
    }
}