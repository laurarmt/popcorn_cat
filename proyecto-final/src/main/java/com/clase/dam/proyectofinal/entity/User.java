package com.clase.dam.proyectofinal.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "users")
public class User {
	
	@Schema(description = "Nombre del usuario", example = "Laura")
	private String name;
	
	@Schema(description = "Apellido del usuario", example = "Rodríguez")
	private String surname;
	
	@Schema(description = "Fecha de nacimiento del usuario", example = "2000-02-01")
	private LocalDate birthDate;
	
	@Schema(description = "Contraseña del usuario", example = "pruebaSwagger")
	private String password;
	
	@Schema(description = "Correo electrónico del usuario", example = "l@gmail.com")
	private String email;
	
	@Schema(description = "Apodo o nickname del usuario", example = "Skadi")
	private String nickname;
	
	@Schema(description = "Puntuación acumulada del usuario", example = "50")
	private Long score = 0L;
	
	@Schema(description = "Indica si el usuario acepta la política de privacidad", example = "true")
	private boolean acceptPrivacity;
	
	@Schema(description = "ID único del usuario", example = "1")
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;
		
	@Schema(description = "Rol del usuario", example = "ADMIN")
	@Enumerated(EnumType.STRING) // Esto asegura que el enum se almacene como texto en la BD
	private Rol rol;
	

    // Relación uno a muchos con las reseñas
	@Schema(description = "Reseñas realizadas por el usuario")
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Review> reviews = new HashSet<>();
    
	@Schema(description = "Partidas de juego del usuario")
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<GameSession> gameSessions = new HashSet<>();

}
