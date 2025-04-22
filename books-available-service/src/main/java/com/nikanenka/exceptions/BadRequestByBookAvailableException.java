package com.nikanenka.exceptions;

public class BadRequestByBookAvailableException extends RuntimeException {
    public BadRequestByBookAvailableException(String message) {
        super(message);
    }
}
