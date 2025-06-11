package com.clase.dam.proyectofinal.component;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.clase.dam.proyectofinal.entity.Rol;
import com.clase.dam.proyectofinal.entity.User;
import com.clase.dam.proyectofinal.repository.UserRepository;
import com.clase.dam.proyectofinal.service.MovieService;


// Genera un user admin si no está creado

@Component
public class LoaderData implements CommandLineRunner {

	    @Autowired
	    private UserRepository userRepository;

	    @Override
	    public void run(String... args) throws Exception {
	        if (!userRepository.findByEmail("l@gmail.com").isPresent()) {
	           
	            User user = new User();
	            user.setName("Laura");
	            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	            user.setPassword(encoder.encode("1234"));
	            user.setSurname("Rodríguez");
	            user.setRol(Rol.ADMIN);
	            user.setBirthDate(LocalDate.of(2000, 2, 1));
	            user.setEmail("l@gmail.com");
	            user.setNickname("Skadi");
	            user.setAcceptPrivacity(true);
	         
	            userRepository.save(user);
	            System.out.println("Usuario admin creado con éxito.");
	        } else {
	            System.out.println("El usuario admin ya existe.");
	        }
	        movieService.loadMoviesAndGenres();
	    }
	    
	    
	    private final MovieService movieService;

	    public LoaderData(MovieService movieService) {
	        this.movieService = movieService;
	    }

	}



