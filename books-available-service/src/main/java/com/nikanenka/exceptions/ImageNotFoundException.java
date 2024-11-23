package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class ImageNotFoundException extends RuntimeException {
    public ImageNotFoundException() {
        super(ExceptionList.IMAGE_NOT_EXISTS.getValue());
    }
}
