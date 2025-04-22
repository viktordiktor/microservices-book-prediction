create table images
(
    id uuid not null
        primary key,
    link varchar(255) not null,
    book_id uuid
        references books
        on delete cascade
);
