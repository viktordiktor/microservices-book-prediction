package com.nikanenka.utils;

import lombok.AllArgsConstructor;

import java.util.ResourceBundle;

@AllArgsConstructor
public enum ExceptionList {
    WRONG_PARAMETER("wrong-parameter"),
    WRONG_SORT_FIELD("wrong-sort-field"),
    FORECAST_NOT_FOUND("forecast-not-found"),
    BAD_REQUEST_BY_BOOK_FORECAST("bad-request-by-book-forecast"),
    INVALID_DATE_EXCEPTION("invalid-date-exception");

    private static final ResourceBundle resourceBundle = ResourceBundle.getBundle("exceptions");
    private final String key;

    public String getValue() {
        return resourceBundle.getString(this.key);
    }
}
