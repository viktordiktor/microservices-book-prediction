package com.nikanenka.models.feign.enums;

public enum Genre {
    NOVEL("Роман"),
    POEMS("Стихи"),
    FANTASY("Фентези"),
    SCIENTIFIC("Научная литература"),
    TALE("Сказка"),
    BIOGRAPHY("Биография"),
    OTHER("Другое");

    private final String label;

    Genre(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
