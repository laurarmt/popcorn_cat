package com.clase.dam.proyectofinal.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clase.dam.proyectofinal.dto.ReviewDTO;
import com.clase.dam.proyectofinal.dto.SessionStatsDto;
import com.clase.dam.proyectofinal.entity.GameAnswer;
import com.clase.dam.proyectofinal.entity.GameSession;
import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.entity.Review;
import com.clase.dam.proyectofinal.entity.User;
import com.clase.dam.proyectofinal.repository.GameSessionRepository;
import com.clase.dam.proyectofinal.repository.MovieRepository;
import com.clase.dam.proyectofinal.repository.ReviewRepository;
import com.clase.dam.proyectofinal.repository.UserRepository;


@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;
    

    public Review addReview(ReviewDTO reviewRequestDto) {
        User user = userRepository.findById(reviewRequestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieRepository.findById(reviewRequestDto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Review review = new Review();
        review.setUser(user);
        review.setMovie(movie);
        review.setRating(reviewRequestDto.getRating());
        review.setText(reviewRequestDto.getText());

        return reviewRepository.save(review);
    }
    
    

    
}

