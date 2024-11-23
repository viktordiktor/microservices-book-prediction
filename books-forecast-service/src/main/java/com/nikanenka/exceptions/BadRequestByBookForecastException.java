package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class BadRequestByBookForecastException extends RuntimeException {
    public BadRequestByBookForecastException(String message) {
        super(String.format(ExceptionList.BAD_REQUEST_BY_BOOK_FORECAST.getValue(), message));
    }
}
