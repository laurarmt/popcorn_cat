package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameSessionResponseDto {
	@Schema(
	        example = "1001",
	        description = "ID único de la partida de juego iniciada"
	    )
	private Long id;
	@Schema(
	        example = "FACIL",
	        description = "Nivel de dificultad de la partida. Valores posibles: FACIL, MEDIA, DIFICIL"
	    )
    private String difficulty;

    public GameSessionResponseDto(Long id, String difficulty) {
        this.id = id;
        this.difficulty = difficulty;
    }
}
