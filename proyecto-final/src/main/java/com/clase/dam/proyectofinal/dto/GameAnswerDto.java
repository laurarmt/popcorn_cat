package com.clase.dam.proyectofinal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameAnswerDto {
	
	@Schema(
	        example = "1",
	        description = "ID de la sesión a la que pertenece esta respuesta"
	    )
	private Long sessionId;
	
	@Schema(
	        example = "true",
	        description = "Indica si la respuesta seleccionada es correcta"
	    )
    private boolean correct;
	
	@Schema(
	        example = "Sinner",
	        description = "Respuesta seleccionada por el usuario"
	    )
    private String selectedAnswer;
	
	@Schema(
	        example = "Sinner",
	        description = "Respuesta correcta para la pregunta"
	    )
    private String correctAnswer;
}
