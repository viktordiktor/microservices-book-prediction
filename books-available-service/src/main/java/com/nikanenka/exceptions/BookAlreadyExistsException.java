package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class BookAlreadyExistsException extends RuntimeException {
    public BookAlreadyExistsException() {
        super(ExceptionList.BOOK_ALREADY_EXISTS.getValue());
    }
}
