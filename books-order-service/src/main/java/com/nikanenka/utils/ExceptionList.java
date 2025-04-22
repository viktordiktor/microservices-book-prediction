package com.nikanenka.utils;

import lombok.AllArgsConstructor;

import java.util.ResourceBundle;

@AllArgsConstructor
public enum ExceptionList {
    WRONG_PARAMETER("wrong-parameter"),
    WRONG_SORT_FIELD("wrong-sort-field"),
    ORDER_NOT_EXISTS("order-not-exists"),
    INVALID_DATE_EXCEPTION("invalid-date-exception"),
    ORDER_ALREADY_EXISTS("order-already-exists");

    private static final ResourceBundle resourceBundle = ResourceBundle.getBundle("exceptions");
    private final String key;

    public String getValue() {
        return resourceBundle.getString(this.key);
    }
}
