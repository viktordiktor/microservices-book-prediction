create table books
(
    id               uuid         not null
        primary key,
    title            varchar(255) not null,
    author           varchar(255) not null,
    genre            varchar(100),
    pages            integer,
    isbn             varchar(20),
    publication_year integer,
    image            varchar(255),
    amount           integer,
    price            numeric
);
INSERT INTO books (id, title, author, genre, pages, isbn, publication_year, image, amount, price)
VALUES ('150228ef-fae3-4e56-823e-b906c529af02', 'Гарри Поттер', 'Джордж Ровлинг', 'FANTASY', 225, '1111234555555', 2003,
        'https://i.imgur.com/AayuFme.jpeg', 12, 100),
       ('369e187c-0ff0-44da-9027-d0f5e41c54c8', 'Джек Лондон', 'Франц Юнг', 'BIOGRAPHY', 125, '1111234444811', 2001,
        'https://i.imgur.com/nCO8B4Y.jpeg', 53, 213),
       ('44e52215-9c18-426a-a135-148b786e90a2', 'Лавр', 'Евгений Водолазкин', 'POEMS', 109, '1111234442810', 2001,
        'https://i.imgur.com/eb2IibV.png', 67, 50),
       ('4d2e591d-3e35-48b8-8cfd-f3858be4e23e', 'Какие большие зубки', 'Роуз Сабо', 'FANTASY', 300, '1111234444810',
        2001, 'https://i.imgur.com/siPRfjt.png', 55, 500.5),
       ('7281ad99-7d85-4231-8a84-014476849cbb', 'Война и мир', 'Лев Толстой', 'NOVEL', 1225, '9781234567840', 1950,
        'https://i.imgur.com/InZHDJS.jpeg', 40, 213.3),
       ('6e1a58d3-704a-4997-8404-97dd3f88d0ae', 'Наваждения', 'Макс Фрай', 'FANTASY', 20, '1111234444819', 2003,
        'https://i.imgur.com/jniyige.jpeg', 55, 213),
       ('82e0004f-63e9-4a9a-bc29-304e7e31188e', 'Поэты России', 'А. С. Пушкин', 'BIOGRAPHY', 300, '1111234444815', 2001,
        'https://i.imgur.com/U7y0RYk.jpeg', 55, 213),
       ('87450991-6902-4a24-84d2-5b1a7cf6a1d0', 'ХОЙ!', 'Ирина Клинских', 'NOVEL', 300, '1111234444817', 2001,
        'https://i.imgur.com/u9m72C3.jpeg', 20, 560),
       ('bfce6971-e3a7-4006-a98b-c3ffc3ad06d8', 'Дуб зеленый', 'Александр Пушкин', 'NOVEL', 30, '1111234444840', 1999,
        'https://i.imgur.com/9gpFDPO.jpeg', 120, 235.99);