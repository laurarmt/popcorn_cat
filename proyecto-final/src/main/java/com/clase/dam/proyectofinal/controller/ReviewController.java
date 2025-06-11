package com.clase.dam.proyectofinal.controller;

import com.clase.dam.proyectofinal.dto.ReviewDTO;
import com.clase.dam.proyectofinal.dto.ReviewResponseDto;
import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.entity.Review;
import com.clase.dam.proyectofinal.entity.User;
import com.clase.dam.proyectofinal.repository.MovieRepository;
import com.clase.dam.proyectofinal.repository.ReviewRepository;
import com.clase.dam.proyectofinal.repository.UserRepository;
import com.clase.dam.proyectofinal.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;


@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;

    @Operation(
    	    summary = "Obtener todas las reseñas",
    	    description = "Devuelve la lista completa de reseñas con información del usuario y la película"
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Lista de reseñas obtenida correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                [
    	                  {
    	                    "id": 1,
    	                    "text": "Una película impresionante, con gran actuación.",
    	                    "rating": "FOUR",
    	                    "userId": 2,
    	                    "nickname": "Skadi",
    	                    "movieId": 5,
    	                    "createdAt": "2024-05-30T14:25:35",
    	                    "movieTitle": "Matrix"
    	                  }
    	                ]
    	            """
    	        )
    	    )
    	)
    @GetMapping
    public List<ReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll().stream().map(review -> {
            ReviewResponseDto dto = new ReviewResponseDto();
            dto.setId(review.getId());
            dto.setText(review.getText());
            dto.setRating(review.getRating());
            dto.setUserId(review.getUser().getId());
            dto.setNickname(review.getUser().getNickname());
            dto.setMovieId(review.getMovie().getId());
            dto.setCreatedAt(review.getCreatedAt().toString()); // Puedes formatear con DateTimeFormatter
            dto.setMovieTitle(review.getMovie().getTitle());
            return dto;
        }).collect(Collectors.toList());
    }

    
    @Operation(
    	    summary = "Crear una nueva reseña",
    	    description = "Permite a un usuario dejar una reseña sobre una película"
    	)
    	@ApiResponse(
    	    responseCode = "201",
    	    description = "Reseña creada correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "id": 1,
    	                  "user": {
    	                    "id": 42,
    	                    "nickname": "cinefan123"
    	                  },
    	                  "movie": {
    	                    "id": 5,
    	                    "title": "Matrix"
    	                  },
    	                  "rating": "FOUR",
    	                  "text": "Una película impresionante, con gran actuación.",
    	                  "createdAt": "2024-05-30T14:25:35"
    	                }
    	            """
    	        )
    	    )
    	)
    	@PostMapping
    	public ResponseEntity<Review> addReview(
    	    @io.swagger.v3.oas.annotations.parameters.RequestBody(
    	        content = @Content(
    	            mediaType = "application/json",
    	            examples = @ExampleObject(
    	                value = """
    	                    {
    	                      "userId": 42,
    	                      "movieId": 5,
    	                      "rating": "FOUR",
    	                      "text": "Una película impresionante, con gran actuación.",
    	                      "createdAt": "2024-05-30T14:25:35"
    	                    }
    	                """
    	            )
    	        )
    	    )@RequestBody ReviewDTO reviewRequestDto) {
        Review review = reviewService.addReview(reviewRequestDto);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }
    
    @Operation(
    	    summary = "Obtener reseñas por película",
    	    description = "Devuelve todas las reseñas realizadas para una película específica"
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Reseñas de la película obtenidas correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                [
    	                  {
    	                    "id": 2,
    	                    "text": "Muy entretenida, ideal para una tarde de cine.",
    	                    "rating": "FIVE",
    	                    "userId": 17,
    	                    "nickname": "moviereviewer",
    	                    "movieId": 5,
    	                    "createdAt": "2024-06-01T18:45:00"
    	                  }
    	                ]
    	            """
    	        )
    	    )
    	)
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByMovie(@PathVariable Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        List<Review> reviews = reviewRepository.findByMovie(movie);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");


        // Convertir cada entidad Review a un DTO
        List<ReviewResponseDto> reviewDtos = reviews.stream().map(review -> {
            ReviewResponseDto dto = new ReviewResponseDto();
            dto.setId(review.getId());
            dto.setText(review.getText());
            dto.setRating(review.getRating());
            dto.setUserId(review.getUser().getId());
            dto.setNickname(review.getUser().getNickname()); 
            dto.setMovieId(review.getMovie().getId());
            dto.setCreatedAt(review.getCreatedAt().format(formatter)); 
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(reviewDtos);
    }
    
    
    @Operation(
    	    summary = "Actualizar una reseña",
    	    description = "Actualiza el texto y la puntuación de una reseña existente"
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Reseña actualizada correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                {
    	                  "id": 1,
    	                  "user": {
    	                    "id": 42,
    	                    "nickname": "cinefan123"
    	                  },
    	                  "movie": {
    	                    "id": 5,
    	                    "title": "Matrix"
    	                  },
    	                  "rating": "FIVE",
    	                  "text": "Actualización: la película mejoró después de verla otra vez.",
    	                  "createdAt": "2024-05-30T14:25:35"
    	                }
    	            """
    	        )
    	    )
    	)
    	@PutMapping("/{reviewId}")
    	public ResponseEntity<Review> updateReview(
    	    @PathVariable Long reviewId,
    	    @io.swagger.v3.oas.annotations.parameters.RequestBody(
    	        content = @Content(
    	            mediaType = "application/json",
    	            examples = @ExampleObject(
    	                value = """
    	                    {
    	                      "userId": 1,
    	                      "movieId": 5,
    	                      "rating": "FIVE",
    	                      "text": "Actualización: la película mejoró después de verla otra vez.",
    	                      "createdAt": "2024-05-30T14:25:35"
    	                    }
    	                """
    	            )
    	        )
    	    ) @RequestBody ReviewDTO dto) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setText(dto.getText());
        review.setRating(dto.getRating());

        return ResponseEntity.ok(reviewRepository.save(review));
    }
    
    @Operation(
    	    summary = "Eliminar una reseña",
    	    description = "Elimina una reseña existente por su ID"
    	)
    	@ApiResponse(
    	    responseCode = "204",
    	    description = "Reseña eliminada correctamente"
    	)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

        reviewRepository.delete(review);
        return ResponseEntity.noContent().build();
    }

    @Operation(
    	    summary = "Obtener reseñas por usuario",
    	    description = "Devuelve todas las reseñas realizadas por un usuario específico"
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Reseñas del usuario obtenidas correctamente",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                [
    	                  {
    	                    "id": 3,
    	                    "text": "Me encantó la actuación del protagonista.",
    	                    "rating": "THREE",
    	                    "userId": 42,
    	                    "nickname": "cinefan123",
    	                    "movieId": 6,
    	                    "createdAt": "2024-05-29T12:00:00",
    	                    "movieTitle": "Inception"
    	                  }
    	                ]
    	            """
    	        )
    	    )
    	)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Review> reviews = reviewRepository.findByUser(user);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        List<ReviewResponseDto> reviewDtos = reviews.stream().map(review -> {
            ReviewResponseDto dto = new ReviewResponseDto();
            dto.setId(review.getId());
            dto.setText(review.getText());
            dto.setRating(review.getRating());
            dto.setUserId(review.getUser().getId());
            dto.setNickname(review.getUser().getNickname());
            dto.setMovieId(review.getMovie().getId());
            dto.setCreatedAt(review.getCreatedAt().format(formatter));
            dto.setMovieTitle(review.getMovie().getTitle());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(reviewDtos);
    }

}
