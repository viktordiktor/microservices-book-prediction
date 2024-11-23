package com.nikanenka.utils;

import lombok.AllArgsConstructor;

import java.util.ResourceBundle;

@AllArgsConstructor
public enum ExceptionList {
    WRONG_PARAMETER("wrong-parameter"),
    WRONG_SORT_FIELD("wrong-sort-field"),
    BOOK_NOT_EXISTS("book-not-exists"),
    IMAGE_NOT_EXISTS("image-not-exists"),
    IMAGE_REQUIRED("image-required"),
    BOOK_ALREADY_EXISTS("book-already-exists");

    private static final ResourceBundle resourceBundle = ResourceBundle.getBundle("exceptions");
    private final String key;

    public String getValue() {
        return resourceBundle.getString(this.key);
    }
}
