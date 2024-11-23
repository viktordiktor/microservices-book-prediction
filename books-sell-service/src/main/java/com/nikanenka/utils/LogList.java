package com.nikanenka.utils;

import lombok.experimental.UtilityClass;

@UtilityClass
public class LogList {
    public static final String LOG_CREATE_SELLING = "Selling created with ID: {}";
    public static final String LOG_GET_SELLING = "Got selling with ID: {}";
    public static final String LOG_EDIT_SELLING = "Selling edited with ID: {}";
    public static final String LOG_DELETE_SELLING = "Selling deleted with ID: {}";
    public static final String LOG_NOT_FOUND_ERROR = "Not Found exception thrown: {}";
    public static final String LOG_BAD_REQUEST_ERROR = "Bad Request exception thrown: {}";
    public static final String LOG_CONFLICT_ERROR = "Conflict exception thrown: {}";
    public static final String LOG_METHOD_ARGUMENT_ERROR = "Not Valid Method Argument exception thrown: {}";
    public static final String LOG_FEIGN_BOOK_AVAILABLE_SERVICE_ERROR = "Can't get response for {} from Book Available service: {}";
    public static final String LOG_DECODE_ERROR = "Error decoding response body: {}";
    public static final String LOG_INVALID_DATE = "Error during date parsing: {}";
}
