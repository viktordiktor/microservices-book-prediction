package com.nikanenka.utils;

import com.nikanenka.dto.ForecastRequest;
import com.nikanenka.dto.feign.BookResponse;
import com.nikanenka.dto.feign.SellingResponse;
import com.nikanenka.models.Forecast;
import com.nikanenka.models.ForecastMethod;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.TreeMap;
import java.util.List;

@Slf4j
@UtilityClass
public class ForecastUtil {

    public static Forecast getLinearRegressionForecast(
            BookResponse book, List<SellingResponse> bookSellsByDays, ForecastRequest createForecastRequest) {
        double[][] forecastData = prepareForecastData(bookSellsByDays);

        double[] x = new double[forecastData.length];
        double[] y = new double[forecastData.length];
        for (int i = 0; i < forecastData.length; i++) {
            x[i] = forecastData[i][0];
            y[i] = forecastData[i][1];
        }

        double[] linearRegressionCoefficients = performLinearRegression(x, y);
        LocalDate startDate = bookSellsByDays.get(0).getDate();
        LocalDate lastDate = bookSellsByDays.get(bookSellsByDays.size() - 1).getDate();

        TreeMap<LocalDate, Double> dayForecast = new TreeMap<>();

        int forecastDays = createForecastRequest.getDaysNecessaryTo();
        for (int i = 1; i <= forecastDays; i++) {
            double prediction =
                    linearRegressionCoefficients[0] + linearRegressionCoefficients[1] * (forecastData.length + i);
            LocalDate predictionDate = lastDate.plusDays(i);

            dayForecast.put(predictionDate, prediction >= 0 ? prediction : 0);
        }

        double summaryForecast = dayForecast.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();
        int summaryRoundedForecast = (int) Math.ceil(summaryForecast);

        int needToBuy = summaryRoundedForecast - book.getAmount();

        return Forecast.builder()
                .method(ForecastMethod.LINEAR_REGRESSION)
                .dayForecast(dayForecast)
                .summaryForecast(summaryForecast)
                .summaryRoundedForecast(summaryRoundedForecast)
                .needToBuyAmount(Math.max(needToBuy, 0))
                .build();
    }

    private static double[][] prepareForecastData(List<SellingResponse> sellsByDays) {
        double[][] data = new double[sellsByDays.size()][2];

        for (int i = 0; i < sellsByDays.size(); i++) {
            data[i][0] = i;
            data[i][1] = sellsByDays.get(i).getAmount();
        }

        return data;
    }

    private static double[] performLinearRegression(double[] x, double[] y) {
        int n = x.length;
        double sumX = 0;
        double sumY = 0;
        double sumXY = 0;
        double sumX2 = 0;

        for (int i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
            sumXY += x[i] * y[i];
            sumX2 += x[i] * x[i];
        }

        double slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        double intercept = (sumY - slope * sumX) / n;

        return new double[]{intercept, slope};
    }

    public static Forecast getExponentialSmoothingForecast(
            BookResponse book, List<SellingResponse> bookSellsByDays, ForecastRequest createForecastRequest) {
        LocalDate lastDate = bookSellsByDays.get(bookSellsByDays.size() - 1).getDate();
        int amount = createForecastRequest.getDaysNecessaryTo();
        double[] sells = bookSellsByDays.stream()
                .mapToDouble(SellingResponse::getAmount)
                .toArray();

        double alpha = 0.2; // Параметр сглаживания
        double[] smoothedSales = simpleExponentialSmoothing(sells, alpha);

        double summaryForecast = smoothedSales[smoothedSales.length - 1] * amount;
        int summaryRoundedForecast = (int) Math.ceil(summaryForecast);

        int needToBuy = summaryRoundedForecast - book.getAmount();

        TreeMap<LocalDate, Double> dayForecast = new TreeMap<>();
        int forecastDays = createForecastRequest.getDaysNecessaryTo();
        for (int i = 1; i <= forecastDays; i++) {
            LocalDate predictionDate = lastDate.plusDays(i);
            dayForecast.put(predictionDate, smoothedSales[smoothedSales.length - 1]);
        }

        return Forecast.builder()
                .method(ForecastMethod.EXPONENTIAL_SMOOTHING)
                .dayForecast(dayForecast)
                .summaryForecast(summaryForecast)
                .summaryRoundedForecast(summaryRoundedForecast)
                .needToBuyAmount(Math.max(needToBuy, 0))
                .build();
    }

    private static double[] simpleExponentialSmoothing(double[] data, double alpha) {
        int n = data.length;
        double[] smoothed = new double[n];
        smoothed[0] = data[0];

        for (int i = 1; i < n; i++) {
            smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
        }
        return smoothed;
    }

    public static Forecast getAverageForecast(
            BookResponse book, List<SellingResponse> bookSellsByDays, ForecastRequest createForecastRequest) {
        int daysAmount = bookSellsByDays.size();
        int bookSellsSum = bookSellsByDays.stream()
                .mapToInt(SellingResponse::getAmount)
                .sum();
        double sellPerDay = (double) bookSellsSum / daysAmount;

        LocalDate lastDate = bookSellsByDays.get(bookSellsByDays.size() - 1).getDate();
        TreeMap<LocalDate, Double> dayForecast = new TreeMap<>();
        int forecastDays = createForecastRequest.getDaysNecessaryTo();
        for (int i = 1; i <= forecastDays; i++) {
            LocalDate predictionDate = lastDate.plusDays(i);
            dayForecast.put(predictionDate, sellPerDay);
        }

        double summaryForecast = sellPerDay * createForecastRequest.getDaysNecessaryTo();
        int summaryRoundedForecast = (int) Math.ceil(summaryForecast);

        int needToBuy = summaryRoundedForecast - book.getAmount();

        return Forecast.builder()
                .method(ForecastMethod.AVERAGE)
                .dayForecast(dayForecast)
                .summaryForecast(summaryForecast)
                .summaryRoundedForecast(summaryRoundedForecast)
                .needToBuyAmount(Math.max(needToBuy, 0))
                .build();
    }
}
