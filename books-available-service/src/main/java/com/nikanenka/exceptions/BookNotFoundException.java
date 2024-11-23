package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException() {
        super(ExceptionList.BOOK_NOT_EXISTS.getValue());
    }
}
