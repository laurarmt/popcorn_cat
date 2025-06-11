package com.clase.dam.proyectofinal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.clase.dam.proyectofinal.entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
	Optional<Movie> findById(Long id);
	
    List<Movie> findByGenres_Name(String genre, Pageable pageable);

    List<Movie> findByGenres_NameAndTitleStartsWith(String genre, String letter, Pageable pageable);

    List<Movie> findByTitleStartsWith(String letter, Pageable pageable);
}

