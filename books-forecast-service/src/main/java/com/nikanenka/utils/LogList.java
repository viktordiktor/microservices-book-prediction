package com.nikanenka.utils;

import lombok.experimental.UtilityClass;

@UtilityClass
public class LogList {
    public static final String LOG_CREATE_FORECAST = "Forecast created with ID: {}";
    public static final String LOG_GET_FORECAST = "Got Forecast with ID: {}";
    public static final String LOG_DELETE_FORECAST = "Forecast deleted with ID: {}";
    public static final String LOG_NOT_FOUND_ERROR = "Not Found exception thrown: {}";
    public static final String LOG_BAD_REQUEST_ERROR = "Bad Request exception thrown: {}";
    public static final String LOG_METHOD_ARGUMENT_ERROR = "Not Valid Method Argument exception thrown: {}";
    public static final String LOG_FEIGN_BOOK_AVAILABLE_SERVICE_ERROR = "Can't get response for ID {} from Book Available service: {}";
    public static final String LOG_FEIGN_BOOK_SELL_SERVICE_ERROR = "Can't get response for ID {} from Book Sell service: {}";
    public static final String LOG_DECODE_ERROR = "Error decoding response body: {}";
}
