package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class InvalidDateException extends RuntimeException {
    public InvalidDateException(String message) {
        super(String.format(ExceptionList.INVALID_DATE_EXCEPTION.getValue(), message));
    }
}