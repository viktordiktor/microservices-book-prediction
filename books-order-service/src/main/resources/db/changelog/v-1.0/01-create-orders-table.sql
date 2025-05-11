CREATE TABLE orders
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id         UUID    NOT NULL,
    amount          INTEGER NOT NULL,
    order_lead_time INTEGER NOT NULL,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_date    DATE    NOT NULL DEFAULT CURRENT_DATE,
    complete_date   DATE
);

-- Комментарии к полям (для документации)
COMMENT ON TABLE orders IS 'Таблица заказов книг';
COMMENT ON COLUMN orders.book_id IS 'Идентификатор книги (FK)';
COMMENT ON COLUMN orders.order_lead_time IS 'Срок выполнения заказа в днях';
COMMENT ON COLUMN orders.completed IS 'Флаг завершения заказа';