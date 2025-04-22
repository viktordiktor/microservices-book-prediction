package com.nikanenka.utils;

import com.nikanenka.models.Order;
import lombok.SneakyThrows;
import lombok.experimental.UtilityClass;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@UtilityClass
public class ExcelUtil {
    public static final String CONTENT_DISPOSITION_HEADER = "attachment; filename=orders_template.xlsx";
    public static final String MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public static final String TEMPLATE_FILE_NAME = "orders_template.xlsx";

    @SneakyThrows
    public List<Order> readOrdersFromExcel(MultipartFile file) {
        List<Order> orders = new ArrayList<>();

        // Проверка на null и тип файла
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Файл не загружен");
        }
        if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            throw new IllegalArgumentException("Требуется файл Excel (.xlsx)");
        }

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheet("orders");
            if (sheet == null) {
                throw new RuntimeException("Лист 'orders' не найден");
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Пропускаем заголовок
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Order order = new Order();

                String bookId = getStringValue(row.getCell(0));
                if (bookId != null && !bookId.isEmpty()) {
                    order.setBookId(UUID.fromString(bookId));
                    order.setOrderLeadTime((int) getNumericValue(row.getCell(1)));
                    order.setAmount((int) getNumericValue(row.getCell(2)));
                    order.setCompleted(false);
                    order.setCreatedDate(LocalDate.now());

                    orders.add(order);
                }
            }
        }
        return orders;
    }

    // Вспомогательные методы для безопасного чтения ячеек
    private String getStringValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((int) cell.getNumericCellValue());
            default -> null;
        };
    }

    private double getNumericValue(Cell cell) {
        if (cell == null) return 0;
        return switch (cell.getCellType()) {
            case NUMERIC -> cell.getNumericCellValue();
            case STRING -> Double.parseDouble(cell.getStringCellValue());
            default -> 0;
        };
    }
}
