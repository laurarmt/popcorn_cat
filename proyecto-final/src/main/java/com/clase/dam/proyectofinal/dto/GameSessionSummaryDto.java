package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GameSessionSummaryDto {
	
	@Schema(example = "1", description = "ID de la sesión de juego")
    private Long sessionId;
	
	@Schema(example = "DIFICIL", description = "Dificultad de la sesión")
    private String difficulty;
	
	@Schema(example = "Skadi", description = "Alias del usuario que jugó la sesión")
    private String userNickname;
	
	@Schema(example = "12", description = "Número de respuestas correctas")
    private int correctAnswers;
	
	@Schema(example = "8", description = "Número de respuestas incorrectas")
    private int incorrectAnswers;
	
	@Schema(example = "20", description = "Número total de preguntas")
    private int totalQuestions;
}

