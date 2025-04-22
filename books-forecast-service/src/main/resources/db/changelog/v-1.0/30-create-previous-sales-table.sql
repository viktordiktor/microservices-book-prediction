create table previous_sales
(
    forecast_id uuid not null,
    sale_date  date             not null,
    sale_value integer not null
);
create index idx_previous_sales
    on previous_sales (forecast_id, sale_date);