package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class WrongPageableParameterException extends RuntimeException {
    public WrongPageableParameterException() {
        super(ExceptionList.WRONG_PARAMETER.getValue());
    }
}
