package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class RequestNotFoundException extends RuntimeException {
    public RequestNotFoundException(String message) {
        super(message);
    }
}
