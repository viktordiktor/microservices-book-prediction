package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class BadRequestByBooksSellException extends RuntimeException {
    public BadRequestByBooksSellException(String message) {
        super(String.format("%s: %s", ExceptionList.BAD_REQUEST_BY_BOOKS_SELL.getValue(), message));
    }
}