package com.clase.dam.proyectofinal.dto;

import com.clase.dam.proyectofinal.entity.Rating;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Schema(name = "ReviewDTO", description = "DTO para creación/actualización de reseña")
@Getter
@Setter
public class ReviewDTO {
	
	@Schema(example = "1")
    private Long userId;
	
	@Schema(example = "11544")
    private Integer movieId;
	
	@Schema(example = "FOUR", allowableValues = {"ONE", "TWO", "THREE", "FOUR", "FIVE"})
    private Rating rating;
	
	@Schema(example = "Una película impresionante, con gran actuación.")
    private String text;
	
	@Schema(example = "2024-05-30T14:25:35")
    private String createdAt;
}

