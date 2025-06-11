package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSessionDto {
	@Schema(
	        example = "FACIL",
	        description = "Nivel de dificultad de la partida. Valores posibles: FACIL, MEDIA, DIFICIL"
	    )
    private String difficulty;
	@Schema(
	        example = "1",
	        description = "ID del usuario que ha iniciado una partida nueva"
	    )
    private Long userId;
}

