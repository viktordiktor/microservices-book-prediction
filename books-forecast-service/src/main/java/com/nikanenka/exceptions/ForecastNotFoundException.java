package com.nikanenka.exceptions;

import com.nikanenka.utils.ExceptionList;

public class ForecastNotFoundException extends RuntimeException {
    public ForecastNotFoundException() {
        super(ExceptionList.FORECAST_NOT_FOUND.getValue());
    }
}
