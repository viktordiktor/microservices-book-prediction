package com.nikonenko.apigateway.utils;

import lombok.AllArgsConstructor;

import java.util.ResourceBundle;

@AllArgsConstructor
public enum ExceptionList {
    BOOKS_AVAILABLE_SERVICE_DOWN("books-available-service-down"),
    BOOKS_FORECAST_SERVICE_DOWN("books-forecast-service-down"),
    BOOKS_SELL_SERVICE_DOWN("books-sell-service-down");

    private static final ResourceBundle resourceBundle = ResourceBundle.getBundle("exceptions");
    private final String key;

    public String getValue() {
        return resourceBundle.getString(this.key);
    }
}