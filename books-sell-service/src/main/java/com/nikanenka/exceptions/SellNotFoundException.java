package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class SellNotFoundException extends RuntimeException {
    public SellNotFoundException() {
        super(ExceptionList.SELL_NOT_EXISTS.getValue());
    }
}
