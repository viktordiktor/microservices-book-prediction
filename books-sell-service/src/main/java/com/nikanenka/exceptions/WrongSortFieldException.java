package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class WrongSortFieldException extends RuntimeException {
    public WrongSortFieldException() {
        super(ExceptionList.WRONG_SORT_FIELD.getValue());
    }
}
