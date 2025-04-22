package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException() {
        super(ExceptionList.ORDER_NOT_EXISTS.getValue());
    }
}
