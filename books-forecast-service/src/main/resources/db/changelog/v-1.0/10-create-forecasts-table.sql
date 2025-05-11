CREATE TABLE forecasts
(
    id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id                    UUID,
    insurance_days             INTEGER,
    insurance_stock            DOUBLE PRECISION,
    rounded_insurance_stock    INTEGER,
    current_amount             INTEGER,
    order_lead_time            INTEGER,
    order_placement_cost       NUMERIC(10, 2),
    storage_cost_per_unit      NUMERIC(10, 2),
    order_point                DOUBLE PRECISION,
    rounded_order_point        INTEGER,
    optimal_batch_size         DOUBLE PRECISION,
    rounded_optimal_batch_size INTEGER,
    created_date               DATE
);