package com.clase.dam.proyectofinal.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "Entidad que representa una reseña realizada por un usuario sobre una película.")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Review {
	@Schema(description = "ID único de la reseña", example = "1")
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  
    
	@Schema(description = "Usuario que realizó la reseña")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user; 
    
	@Schema(description = "Película reseñada")
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;  
    
	@Schema(description = "Puntuación otorgada en la reseña", example = "FOUR", allowableValues = {"ONE", "TWO", "THREE", "FOUR", "FIVE"})
    @Enumerated(EnumType.STRING) // Esto asegura que el enum se almacene como texto en la BD
	private Rating rating;
    
	@Schema(description = "Texto de la reseña", example = "Una película impresionante, con gran actuación.")
    @Column(length = 4000)
    private String text;  
    
	@Schema(description = "Fecha y hora de creación de la reseña", example = "2024-05-30T14:25:35")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();  
}
