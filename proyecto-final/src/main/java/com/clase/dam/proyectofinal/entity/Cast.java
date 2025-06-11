package com.clase.dam.proyectofinal.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Cast {
	 	@Id
	    private Integer id;      
	    private String name;
		private String original_name;
		@JsonProperty("character")
	    private String characterName;

		private String known_for_department;
		
		
	    @ManyToMany(mappedBy = "cast") 
	    @JsonBackReference 
	    private Set<Movie> movies;
}