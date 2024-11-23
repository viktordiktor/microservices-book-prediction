package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class SellAlreadyExistsException extends RuntimeException {
    public SellAlreadyExistsException() {
        super(ExceptionList.SELL_ALREADY_EXISTS.getValue());
    }
}
