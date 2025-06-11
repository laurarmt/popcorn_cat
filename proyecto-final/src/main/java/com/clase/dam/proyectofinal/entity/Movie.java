package com.clase.dam.proyectofinal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;


@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Getter
@Setter
@Entity
public class Movie {
	
	    @Id
	    private Integer id;
	    private String title;
	    private String original_title;
	    private String release_date;

	    @Column(length = 4000)
	    private String overview;
	    private String original_language;
	    private String poster_path;
	    

	    @ManyToMany
	    @JoinTable(
	        name = "movie_genre",
	        joinColumns = @JoinColumn(name = "movie_id"),
	        inverseJoinColumns = @JoinColumn(name = "genre_id")
	    )
	    private Set<Genre> genres = new HashSet<>();

	   

	    @Transient 
	    private Set<Integer> genre_ids;
	    
	    
	    
	    //Otra URL

	    private Integer runtime;
	    
	    @ManyToMany
	    @JoinTable(
	        name = "movie_cast",
	        joinColumns = @JoinColumn(name = "movie_id"),
	        inverseJoinColumns = @JoinColumn(name = "cast_id")
	    )
	    private Set<Cast> cast = new HashSet<>();
	    
	    
	    @Transient 
	    private Set<Integer> cast_id;
	    
	    
	    @ManyToMany
	    @JoinTable(
	        name = "movie_crew",
	        joinColumns = @JoinColumn(name = "movie_id"),
	        inverseJoinColumns = @JoinColumn(name = "crew_id")
	    )
	    private Set<Crew> crew = new HashSet<>();
	    
	    
	    @Transient 
	    private Set<Integer> crew_id;
	   
	    
	    //Review
	    
	    // Relación uno a muchos con las reseñas
	    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
	    private Set<Review> reviews = new HashSet<>();
	}

