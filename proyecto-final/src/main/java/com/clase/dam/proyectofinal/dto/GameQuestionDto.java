package com.clase.dam.proyectofinal.dto;

import java.util.List;

import com.clase.dam.proyectofinal.entity.Difficulty;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameQuestionDto {
	@Schema(example = "1", description = "ID de la pregunta")
	private Long id;
	
	@Schema(example = "As Stitch, a runaway genetic experiment "
			+ "from a faraway planet, wreaks havoc on the Hawaiian Islands, "
			+ "he becomes the mischievous adopted alien \"puppy\" of an independent "
			+ "little girl named Lilo and learns about loyalty, friendship, and ʻohana, "
			+ "the Hawaiian tradition of family.", description = "Sinopsis de la película")
    private String overview;
	
	@Schema(
	        example = "[\"Lilo & Stitch\", \"Final Destination Bloodlines\", \"Lilo & Stitch 2: Stitch Has a Glitch\", \"Final Destination Bloodlines\"]",
	        description = "Opciones de respuesta disponibles"
	    )
    private List<String> options;
	
	@Schema(example = "Lilo & Stitch", description = "Respuesta correcta")
    private String correctAnswer;
	
	@Schema(example = "MEDIA", description = "Dificultad de la pregunta")
    private Difficulty difficulty;
}
