package com.nikanenka.utils;

import lombok.AllArgsConstructor;

import java.util.ResourceBundle;

@AllArgsConstructor
public enum ExceptionList {
    WRONG_PARAMETER("wrong-parameter"),
    WRONG_SORT_FIELD("wrong-sort-field"),
    SELL_NOT_EXISTS("sell-not-exists"),
    NOT_ENOUGH_BOOKS("not-enough-books"),
    BAD_REQUEST_BY_BOOKS_SELL("bad-request-by-books-sell"),
    INVALID_DATE_EXCEPTION("invalid-date-exception"),
    SELL_ALREADY_EXISTS("sell-already-exists");

    private static final ResourceBundle resourceBundle = ResourceBundle.getBundle("exceptions");
    private final String key;

    public String getValue() {
        return resourceBundle.getString(this.key);
    }
}
