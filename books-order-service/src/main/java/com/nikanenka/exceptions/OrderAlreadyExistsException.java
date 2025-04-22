package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class OrderAlreadyExistsException extends RuntimeException {
    public OrderAlreadyExistsException() {
        super(ExceptionList.ORDER_ALREADY_EXISTS    .getValue());
    }
}
