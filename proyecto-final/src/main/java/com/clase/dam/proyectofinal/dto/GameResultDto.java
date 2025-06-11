package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameResultDto {
	@Schema(
	        example = "FACIL",
	        description = "Dificultad de la sesión (por ejemplo: FACIL, MEDIA, DIFICIL)"
	    )
	private String difficulty;

	@Schema(
	        example = "true",
	        description = "Indica si la respuesta fue correcta"
	    )
    private boolean correct;

	@Schema(
	        example = "Sinner",
	        description = "Respuesta seleccionada por el usuario"
	    )
    private String selectedAnswer;

	@Schema(
	        example = "Sinner",
	        description = "Respuesta correcta de la pregunta"
	    )
    private String correctAnswer;

	@Schema(
	        example = "1",
	        description = "ID del usuario que participó en la sesión"
	    )
    private Long userId;
}
