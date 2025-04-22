CREATE TABLE forecasts
(
    id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID с автогенерацией
    book_id                    UUID,                                       -- ID книги
    insurance_days             INTEGER,                                    -- страховые дни (int)
    insurance_stock            INTEGER,                                    -- страховой запас (int)
    order_lead_time            INTEGER,                                    -- время выполнения заказа (int)
    order_placement_cost       NUMERIC(10, 2),                             -- стоимость размещения заказа (деньги, NUMERIC для точности)
    storage_cost_per_unit      NUMERIC(10, 2),                             -- стоимость хранения единицы товара (деньги)
    order_point                DOUBLE PRECISION,                           -- точка заказа (double)
    rounded_order_point        INTEGER,                                    -- округлённая точка заказа (int)
    optimal_batch_size         DOUBLE PRECISION,                           -- оптимальная партия (double)
    rounded_optimal_batch_size INTEGER                                     -- округлённая оптимальная партия (int)
);