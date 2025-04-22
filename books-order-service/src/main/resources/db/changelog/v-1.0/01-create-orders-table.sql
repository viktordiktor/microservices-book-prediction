CREATE TABLE orders
(
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Автогенерация UUID
    book_id         UUID    NOT NULL,                           -- Ссылка на книгу
    amount          INTEGER NOT NULL,                           -- Количество в заказе
    order_lead_time INTEGER NOT NULL,                           -- Время выполнения заказа в днях
    completed       BOOLEAN NOT NULL DEFAULT FALSE,             -- Статус выполнения (по умолчанию false)
    created_date    DATE    NOT NULL DEFAULT CURRENT_DATE,      -- Дата создания (текущая дата по умолчанию)
    complete_date   DATE                                        -- Дата завершения (может быть NULL)
);

-- Комментарии к полям (для документации)
COMMENT ON TABLE orders IS 'Таблица заказов книг';
COMMENT ON COLUMN orders.book_id IS 'Идентификатор книги (FK)';
COMMENT ON COLUMN orders.order_lead_time IS 'Срок выполнения заказа в днях';
COMMENT ON COLUMN orders.completed IS 'Флаг завершения заказа';