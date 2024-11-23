package com.nikanenka.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.TreeMap;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "forecasts")
public class Forecast {
    @Id
    @UuidGenerator
    @Column(name="id")
    private UUID id;
    @Column(name="method")
    private ForecastMethod method;
    @ElementCollection(fetch= FetchType.EAGER)
    @CollectionTable(name = "forecast_day_forecast", joinColumns = @JoinColumn(name = "forecast_id"))
    @MapKeyColumn(name = "forecast_date")
    @OrderColumn(name = "name")
    @Column(name = "forecast_value")
    private Map<LocalDate, Double> dayForecast = new TreeMap<>();
    @Column(name="summary_forecast")
    private Double summaryForecast;
    @Column(name="summary_rounded_forecast")
    private Integer summaryRoundedForecast;
    @Column(name="need_to_buy_amount")
    private Integer needToBuyAmount;
    @ManyToOne
    @JoinColumn(name = "global_forecast_id")
    private GlobalForecast globalForecast;
}
