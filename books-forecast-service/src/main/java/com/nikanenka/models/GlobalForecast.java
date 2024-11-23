package com.nikanenka.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.TreeMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "global_forecasts")
public class GlobalForecast {
    @Id
    @UuidGenerator
    @Column(name = "id")
    private UUID id;
    @Column(name = "book_id")
    private UUID bookId;
    @Column(name = "from_date")
    private LocalDate fromDate;
    @Column(name = "to_date")
    private LocalDate toDate;
    @Column(name = "days_necessary_to")
    private Integer daysNecessaryTo;
    @Column(name = "current_amount")
    private Integer currentAmount;
    @OneToMany(mappedBy = "globalForecast", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Forecast> forecasts = new HashSet<>();

    @ElementCollection(fetch= FetchType.EAGER)
    @CollectionTable(name = "previous_sales", joinColumns = @JoinColumn(name = "global_forecast_id"))
    @MapKeyColumn(name = "sale_date")
    @OrderColumn(name = "name")
    @Column(name = "sale_value")
    private Map<LocalDate, Integer> previousSales = new TreeMap<>();
}
