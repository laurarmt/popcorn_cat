package com.clase.dam.proyectofinal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clase.dam.proyectofinal.entity.Genre;
import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.repository.MovieRepository;
import com.clase.dam.proyectofinal.service.MovieService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;

@RestController
@RequestMapping("/api")
public class MovieController {
	
	@Autowired
	private MovieRepository movieRepository;
	
	@Autowired
    private MovieService movieService;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Operation(
    	    summary = "Obtener todas las películas",
    	    description = "Recupera una lista de todas las películas disponibles en la base de datos."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Lista de películas recuperada exitosamente.",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                [
    	                  {
    	                    "id": 1,
    	                    "title": "Inception",
    	                    "original_title": "Inception",
    	                    "release_date": "2010-07-16",
    	                    "overview": "Un ladrón que roba secretos corporativos...",
    	                    "original_language": "en",
    	                    "poster_path": "/qOa8l6M9CC9ZgQKk6a5M3Gz5ZzF.jpg",
    	                    "genres": [
    	                      {
    	                        "id": 18,
    	                        "name": "Drama"
    	                      },
    	                      {
    	                        "id": 878,
    	                        "name": "Ciencia ficción"
    	                      }
    	                    ],
    	                    "runtime": 148
    	                  }
    	                ]
    	            """
    	        )
    	    )
    	)
    @GetMapping("/movies")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
    
    @Operation(
    	    summary = "Obtener una película por ID",
    	    description = "Recupera los detalles de una película específica utilizando su ID."
    	)
    	@ApiResponses({
    	    @ApiResponse(
    	        responseCode = "200",
    	        description = "Detalles de la película recuperados exitosamente.",
    	        content = @Content(
    	            mediaType = "application/json",
    	            examples = @ExampleObject(
    	                value = """
    	                    {
    	                      "id": 1,
    	                      "title": "Inception",
    	                      "original_title": "Inception",
    	                      "release_date": "2010-07-16",
    	                      "overview": "Un ladrón que roba secretos corporativos...",
    	                      "original_language": "en",
    	                      "poster_path": "/qOa8l6M9CC9ZgQKk6a5M3Gz5ZzF.jpg",
    	                      "genres": [
    	                        {
    	                          "id": 18,
    	                          "name": "Drama"
    	                        },
    	                        {
    	                          "id": 878,
    	                          "name": "Ciencia ficción"
    	                        }
    	                      ],
    	                      "runtime": 148
    	                    }
    	                """
    	            )
    	        )
    	    ),
    	    @ApiResponse(
    	        responseCode = "404",
    	        description = "Película no encontrada."
    	    )
    	})
    @GetMapping("/movies/{id}")
    public Optional<Movie> getUserById(@PathVariable Long id) {
        return movieRepository.findById(id);
    }
    
    @Operation(
    	    summary = "Obtener todos los géneros",
    	    description = "Recupera una lista de todos los géneros de películas disponibles."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Lista de géneros recuperada exitosamente.",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                [
    	                  {
    	                    "id": 28,
    	                    "name": "Acción"
    	                  },
    	                  {
    	                    "id": 35,
    	                    "name": "Comedia"
    	                  },
    	                  {
    	                    "id": 18,
    	                    "name": "Drama"
    	                  }
    	                ]
    	            """
    	        )
    	    )
    	)
    @GetMapping("/genres")
    public List<Genre> getGenres() {
        return movieService.getAllGenres();
    }
    
 // Endpoint para obtener las películas con filtros
    @Operation(
    	    summary = "Filtrar películas",
    	    description = "Recupera una lista de películas que coinciden con los filtros especificados."
    	)
    	@ApiResponse(
    	    responseCode = "200",
    	    description = "Lista de películas filtradas recuperada exitosamente.",
    	    content = @Content(
    	        mediaType = "application/json",
    	        examples = @ExampleObject(
    	            value = """
    	                [
    	                  {
    	                    "id": 2,
    	                    "title": "Interstellar",
    	                    "original_title": "Interstellar",
    	                    "release_date": "2014-11-07",
    	                    "overview": "Un grupo de exploradores viaja a través de un agujero de gusano...",
    	                    "original_language": "en",
    	                    "poster_path": "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    	                    "genres": [
    	                      {
    	                        "id": 12,
    	                        "name": "Aventura"
    	                      },
    	                      {
    	                        "id": 18,
    	                        "name": "Drama"
    	                      },
    	                      {
    	                        "id": 878,
    	                        "name": "Ciencia ficción"
    	                      }
    	                    ],
    	                    "runtime": 169
    	                  }
    	                ]
    	            """
    	        )
    	    )
    	)
    @GetMapping("/movies/filter")
    public ResponseEntity<List<Movie>> getMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String letter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(required = false) String sort) {

        List<Movie> movies = movieService.getMovies(genre, letter, page, size, sort);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }
    
    //Comparador
    @Operation(
    	    summary = "Comparar dos películas",
    	    description = "Compara dos películas por sus IDs y devuelve los detalles de ambas."
    	)
    	@ApiResponses(value = {
    	    @ApiResponse(
    	        responseCode = "200",
    	        description = "Películas encontradas y comparadas exitosamente.",
    	        content = @Content(
    	            mediaType = "application/json",
    	            examples = @ExampleObject(
    	                value = """
    	                    {
    	                      "movie1": {
    	                        "id": 1,
    	                        "title": "Inception",
    	                        "original_title": "Inception",
    	                        "release_date": "2010-07-16",
    	                        "overview": "Un ladrón especializado en el arte de robar ideas a través de los sueños.",
    	                        "original_language": "en",
    	                        "poster_path": "/inception.jpg",
    	                        "genres": [
    	                          {
    	                            "id": 878,
    	                            "name": "Ciencia ficción"
    	                          },
    	                          {
    	                            "id": 28,
    	                            "name": "Acción"
    	                          }
    	                        ],
    	                        "runtime": 148
    	                      },
    	                      "movie2": {
    	                        "id": 2,
    	                        "title": "Interstellar",
    	                        "original_title": "Interstellar",
    	                        "release_date": "2014-11-07",
    	                        "overview": "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.",
    	                        "original_language": "en",
    	                        "poster_path": "/interstellar.jpg",
    	                        "genres": [
    	                          {
    	                            "id": 12,
    	                            "name": "Aventura"
    	                          },
    	                          {
    	                            "id": 18,
    	                            "name": "Drama"
    	                          },
    	                          {
    	                            "id": 878,
    	                            "name": "Ciencia ficción"
    	                          }
    	                        ],
    	                        "runtime": 169
    	                      }
    	                    }
    	                """
    	            )
    	        )
    	    ),
    	    @ApiResponse(
    	        responseCode = "404",
    	        description = "Una o ambas películas no fueron encontradas."
    	    )
    	})
    @GetMapping("/movies/compare")
    public ResponseEntity<Map<String, Movie>> compararPeliculas(
            @RequestParam Integer id1,
            @RequestParam Integer id2) {

        Optional<Movie> movie1 = movieRepository.findById(id1.longValue());
        Optional<Movie> movie2 = movieRepository.findById(id2.longValue());

        if (movie1.isEmpty() || movie2.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Movie> resultado = new HashMap<>();
        resultado.put("movie1", movie1.get());
        resultado.put("movie2", movie2.get());

        return ResponseEntity.ok(resultado);
    }

    
}
