package com.clase.dam.proyectofinal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.entity.Review;
import com.clase.dam.proyectofinal.entity.User;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovieId(Long movieId);
    List<Review> findByMovie(Movie movie);
    List<Review> findByUser(User user);

}
