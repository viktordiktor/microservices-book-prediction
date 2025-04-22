package com.nikanenka.utils;

import com.nikanenka.dto.ForecastRequest;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ForecastUtil {
    public double getInsuranceStock(ForecastRequest forecastRequest, double averageSells) {
        return forecastRequest.getInsuranceDays() * averageSells;
    }

    public double getOrderPoint(ForecastRequest forecastRequest, double averageSells) {
        return forecastRequest.getOrderLeadTime() * averageSells + getInsuranceStock(forecastRequest, averageSells);
    }

    public double getOptimalBatch(ForecastRequest forecastRequest, int soldBooks) {
        return Math.sqrt(
                2 * soldBooks * forecastRequest.getOrderPlacementCost().doubleValue()
                        / forecastRequest.getStorageCostPerUnit().doubleValue());

    }
}
