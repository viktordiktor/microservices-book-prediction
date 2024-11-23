package com.nikanenka.utils;

import lombok.experimental.UtilityClass;

@UtilityClass
public class LogList {
    public static final String LOG_CREATE_BOOK = "Book created with ID: {}";
    public static final String LOG_GET_BOOK = "Got book with ID: {}";
    public static final String LOG_EDIT_BOOK = "Book edited with ID: {}";
    public static final String LOG_DELETE_BOOK = "Book deleted with ID: {}";
    public static final String LOG_NOT_FOUND_ERROR = "Not Found exception thrown: {}";
    public static final String LOG_BAD_REQUEST_ERROR = "Bad Request exception thrown: {}";
    public static final String LOG_CONFLICT_ERROR = "Conflict exception thrown: {}";
    public static final String LOG_METHOD_ARGUMENT_ERROR = "Not Valid Method Argument exception thrown: {}";
}
