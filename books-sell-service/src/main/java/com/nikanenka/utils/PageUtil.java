package com.nikanenka.utils;

import com.nikanenka.exceptions.WrongPageableParameterException;
import com.nikanenka.exceptions.WrongSortFieldException;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.lang.reflect.Field;
import java.util.stream.Stream;

@UtilityClass
public class PageUtil {
    public static <T> Pageable createPageable
            (int pageNumber, int pageSize, String sortField, String sortType, Class<T> clazz) {
        if (pageNumber < 0 || pageSize < 1) {
            throw new WrongPageableParameterException();
        }
        checkSortField(sortField, clazz);
        return sortType.equals("desc")
                ? PageRequest.of(pageNumber, pageSize, Sort.by(sortField).descending())
                : PageRequest.of(pageNumber, pageSize, Sort.by(sortField).ascending());
    }
    private <T> void checkSortField(String sortField, Class<T> clazz) {
        if (Stream.of(clazz.getDeclaredFields())
                .map(Field::getName)
                .noneMatch(field -> field.equals(sortField))) {
            throw new WrongSortFieldException();
        }
    }
}