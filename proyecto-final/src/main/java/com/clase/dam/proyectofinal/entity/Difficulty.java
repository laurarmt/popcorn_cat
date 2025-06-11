package com.clase.dam.proyectofinal.entity;

public enum Difficulty {
	FACIL(3),
    MEDIA(4),
    DIFICIL(5);

    private final int optionCount;

    Difficulty(int optionCount) {
        this.optionCount = optionCount;
    }

    public int getOptionCount() {
        return optionCount;
    }
}
