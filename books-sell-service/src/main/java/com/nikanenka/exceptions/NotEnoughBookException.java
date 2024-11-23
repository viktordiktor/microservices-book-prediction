package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class NotEnoughBookException extends RuntimeException {
    public NotEnoughBookException() {
        super(ExceptionList.NOT_ENOUGH_BOOKS.getValue());
    }
}
