package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionStatsDto {
	
	@Schema(example = "1", description = "ID de la sesión de juego")
    private Long sessionId;
	
	@Schema(example = "MEDIA", description = "Dificultad de la sesión")
    private String difficulty;
	
	@Schema(example = "7", description = "Número de respuestas correctas")
    private int correctCount;
	
	@Schema(example = "3", description = "Número de respuestas incorrectas")
    private int wrongCount;
	
	@Schema(example = "10", description = "Número total de preguntas respondidas")
    private int total;
}

