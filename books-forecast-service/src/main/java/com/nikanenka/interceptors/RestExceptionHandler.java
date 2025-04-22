package com.nikanenka.interceptors;

import com.nikanenka.dto.ExceptionResponse;
import com.nikanenka.exceptions.ForecastNotFoundException;
import com.nikanenka.exceptions.InvalidDateException;
import com.nikanenka.exceptions.WrongPageableParameterException;
import com.nikanenka.exceptions.WrongSortFieldException;
import com.nikanenka.utils.LogList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
@Slf4j
public class RestExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<String> errorMessages = new ArrayList<>();

        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            errorMessages.add(fieldError.getDefaultMessage());
        }

        log.error(LogList.LOG_METHOD_ARGUMENT_ERROR, errorMessages);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorMessages);
    }

    @ExceptionHandler(ForecastNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleNotFoundException(ForecastNotFoundException ex) {
        log.error(LogList.LOG_NOT_FOUND_ERROR, ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ExceptionResponse(ex.getMessage(), HttpStatus.NOT_FOUND));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class,
            PropertyReferenceException.class, WrongPageableParameterException.class,
            MethodArgumentTypeMismatchException.class, WrongSortFieldException.class,
            InvalidDateException.class})
    public ResponseEntity<ExceptionResponse> handleBadRequestException(RuntimeException ex) {
        log.error(LogList.LOG_BAD_REQUEST_ERROR, ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ExceptionResponse(ex.getMessage(), HttpStatus.BAD_REQUEST));
    }
}