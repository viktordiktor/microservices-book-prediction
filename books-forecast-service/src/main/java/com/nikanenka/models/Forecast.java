package com.nikanenka.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "id", columnDefinition = "UUID DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "book_id")
    private UUID bookId;

    @Column(name = "insurance_days")
    private Integer insuranceDays;

    @Column(name = "insurance_stock")
    private Double insuranceStock;

    @Column(name = "current_amount")
    private Integer currentAmount;

    @Column(name = "rounded_insurance_stock")
    private Integer roundedInsuranceStock;

    @Column(name = "order_lead_time")
    private Integer orderLeadTime;

    @Column(name = "order_placement_cost", precision = 10, scale = 2)
    private BigDecimal orderPlacementCost;

    @Column(name = "storage_cost_per_unit", precision = 10, scale = 2)
    private BigDecimal storageCostPerUnit;

    @Column(name = "order_point")
    private Double orderPoint;

    @Column(name = "rounded_order_point")
    private Integer roundedOrderPoint;

    @Column(name = "optimal_batch_size")
    private Double optimalBatchSize;

    @Column(name = "rounded_optimal_batch_size")
    private Integer roundedOptimalBatchSize;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @ElementCollection(fetch= FetchType.EAGER)
    @CollectionTable(name = "previous_sales", joinColumns = @JoinColumn(name = "forecast_id"))
    @MapKeyColumn(name = "sale_date")
    @OrderColumn(name = "name")
    @Column(name = "sale_value")
    private Map<LocalDate, Integer> previousSales = new TreeMap<>();
}
