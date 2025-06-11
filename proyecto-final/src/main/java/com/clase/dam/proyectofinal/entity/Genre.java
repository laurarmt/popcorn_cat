package com.clase.dam.proyectofinal.entity;
/*
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@Entity
public class Genre {
    @Id
    private Integer id;       // ID del género
    private String name;      // Nombre del género

    // Constructor vacío necesario para la deserialización
    public Genre() {
    }

    // Constructor que acepta solo el ID, si lo necesitas para deserializar
    public Genre(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
    
    @ManyToMany(mappedBy = "genres")
    //@JsonBackReference
    private Set<Movie> movies; 
}
*/

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Genre {
    @Id
    private Integer id;       
    private String name;      


    // Constructor que acepta solo el ID, si lo necesitas para deserializar
    public Genre(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    // Relación bidireccional con Movies
    @ManyToMany(mappedBy = "genres") // Esto indica que esta relación es mapeada por la clase Movie
    @JsonBackReference  // Esto evita que Jackson recursivamente serialize la relación
    private Set<Movie> movies;
}
