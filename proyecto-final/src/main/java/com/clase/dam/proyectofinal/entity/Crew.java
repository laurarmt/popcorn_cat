package com.clase.dam.proyectofinal.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Crew {
	 	@Id
	    private Integer id;      
	    private String name;
		private String original_name;
		private String department;
		private String job;
		
		
		// Relación bidireccional con Movies
	    @ManyToMany(mappedBy = "crew") // Esto indica que esta relación es mapeada por la clase Movie
	    @JsonBackReference  // Esto evita que Jackson recursivamente serialize la relación
	    private Set<Movie> movies;
}
