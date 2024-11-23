package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class ImageRequiredException extends RuntimeException {
    public ImageRequiredException() {
        super(ExceptionList.IMAGE_REQUIRED.getValue());
    }
}
