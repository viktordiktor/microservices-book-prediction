package com.nikanenka.utils;

import com.nikanenka.models.Forecast;
import lombok.SneakyThrows;
import lombok.experimental.UtilityClass;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@UtilityClass
public class ExcelUtil {

    @SneakyThrows
    public static Resource generateForecastExport(List<Forecast> forecasts) {
        // 1. Создаем workbook
        Workbook workbook = new XSSFWorkbook();

        // 2. Создаем лист
        Sheet sheet = workbook.createSheet("forecasts");

        // 3. Заполняем заголовки
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "ID книги", "Количество страховых дней", "Время доставки", "Стоимость заказа", "Стоимость хранения единицы заказа", "Страховой запас", "Округленный страховой запас", "Точка запаса", "Округленная точка заказа", "Оптимальная партия заказа", "Округленная оптимальная партия заказа"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        for (int i = 0; i < forecasts.size(); i++) {
            Row row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(forecasts.get(i).getId().toString());
            row.createCell(1).setCellValue(forecasts.get(i).getBookId().toString());
            row.createCell(2).setCellValue(forecasts.get(i).getInsuranceDays().toString());
            row.createCell(3).setCellValue(forecasts.get(i).getOrderLeadTime().toString());
            row.createCell(4).setCellValue(forecasts.get(i).getOrderPlacementCost().toString());
            row.createCell(5).setCellValue(forecasts.get(i).getStorageCostPerUnit().toString());
            row.createCell(6).setCellValue(forecasts.get(i).getInsuranceStock().toString());
            row.createCell(7).setCellValue(forecasts.get(i).getRoundedInsuranceStock().toString());
            row.createCell(8).setCellValue(forecasts.get(i).getOrderPoint().toString());
            row.createCell(9).setCellValue(forecasts.get(i).getRoundedOrderPoint().toString());
            row.createCell(10).setCellValue(forecasts.get(i).getOptimalBatchSize().toString());
            row.createCell(11).setCellValue(forecasts.get(i).getRoundedOptimalBatchSize().toString());
        }

        // 6. Автоподбор ширины колонок
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // 7. Конвертируем в byte[]
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return new ByteArrayResource(outputStream.toByteArray());
    }

}
