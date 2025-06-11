package com.clase.dam.proyectofinal.service;

import com.clase.dam.proyectofinal.entity.Cast;
import com.clase.dam.proyectofinal.entity.Crew;
import com.clase.dam.proyectofinal.entity.Genre;
import com.clase.dam.proyectofinal.entity.Movie;
import com.clase.dam.proyectofinal.repository.CastRepository;
import com.clase.dam.proyectofinal.repository.CrewRepository;
import com.clase.dam.proyectofinal.repository.GenreRepository;
import com.clase.dam.proyectofinal.repository.MovieRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Service
@Transactional
public class MovieService {

	@Value("${tmdb.api.key}")
    private String apiKey; // API Key almacenada en application.properties

    private final RestTemplate restTemplate;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;
    
    @Autowired
    private CrewRepository crewRepository;
    
    @Autowired
    private CastRepository castRepository;

    public MovieService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Carga las películas y géneros desde la API y los guarda en la base de datos.
     */
    public void loadMoviesAndGenres() {
        // Obtener géneros primero y guardarlos en la BBDD
        String genreUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey;
        ResponseEntity<GenreResponse> genreResponse = restTemplate.getForEntity(genreUrl, GenreResponse.class);
        saveGenres(genreResponse.getBody().getGenres());

        // Obtener películas 
        for (int page = 1; page <= 2; page++) { 
            String movieUrl = "https://api.themoviedb.org/3/movie/popular?page=" + page + "&api_key=" + apiKey;
            ResponseEntity<MovieResponse> movieResponse = restTemplate.getForEntity(movieUrl, MovieResponse.class);
            saveMovies(movieResponse.getBody().getResults());
        }
    }

  
    public void saveGenres(List<Genre> genres) {
        genreRepository.saveAll(genres);
    }

    /**
     * Guarda las películas en la base de datos asegurando que los géneros sean referenciados correctamente.
     */
    public void saveMovies(List<Movie> movies) {
        for (Movie movie : movies) {
            Set<Genre> genres = new HashSet<>();

            // Si movie.getGenre_ids() está disponible, asignamos los géneros manualmente
            if (movie.getGenre_ids() != null) {
                for (Integer genreId : movie.getGenre_ids()) {
                    Genre existingGenre = genreRepository.findById(genreId).orElse(null);
                    if (existingGenre != null) {
                        genres.add(existingGenre);
                    }
                }
            }
            
            //runtime
            Integer runtime = fetchMovieRuntime(movie.getId());
            movie.setRuntime(runtime);
         // Obtener y guardar el cast y crew
            saveMovieCastAndCrew(movie);

            movie.setGenres(genres); // Asegura que la relación ManyToMany se establece
            movieRepository.save(movie);
        }
    }

    public void saveMovieCastAndCrew(Movie movie) {
        // URL para obtener el cast y crew de la película
        String url = "https://api.themoviedb.org/3/movie/" + movie.getId() + "/credits?api_key=" + apiKey;
        ResponseEntity<MovieCreditsResponse> response = restTemplate.getForEntity(url, MovieCreditsResponse.class);
        
        if (response.getBody() != null) {
            MovieCreditsResponse credits = response.getBody();
            
            // Guardar los cast y crew de la película
            saveCast(movie, credits.getCast());
            saveCrew(movie, credits.getCrew());
        }
    }

    public void saveCast(Movie movie, List<Cast> castList) {
        Set<Cast> castSet = new HashSet<>();
        for (Cast castMember : castList) {
            // Buscar si el castMember ya existe en la base de datos
            Cast existingCast = castRepository.findById(castMember.getId()).orElse(null);
            if (existingCast == null) {
                // Si el actor no existe, lo guardamos
                castRepository.save(castMember);
                castSet.add(castMember);  // Lo añadimos al set de cast
            } else {
                // Si ya existe, simplemente lo añadimos al set
                castSet.add(existingCast);
            }
        }
        movie.setCast(castSet);  // Asignamos el cast a la película
    }


    public void saveCrew(Movie movie, List<Crew> crewList) {
        Set<Crew> crewSet = new HashSet<>();
        
        for (Crew crewMember : crewList) {
            // Verificar si el miembro del crew ya existe en la base de datos usando su ID de TMDB
            Crew existingCrew = crewRepository.findCrewById(crewMember.getId()); // findByTmdbId es un método customizado para encontrar por ID de TMDB
            
            if (existingCrew == null) {
                // Si no existe, lo guardamos en la base de datos
                crewRepository.save(crewMember);
                crewSet.add(crewMember);
            } else {
                // Si ya existe, lo agregamos directamente
                crewSet.add(existingCrew);
            }
        }
        
        // Asignar el conjunto de crew a la película
        movie.setCrew(crewSet);
        movieRepository.save(movie); // Guardar la película con el crew actualizado
    }


    
    static class MovieCreditsResponse {
        private List<Cast> cast;
        private List<Crew> crew;

        public List<Cast> getCast() {
            return cast;
        }

        public void setCast(List<Cast> cast) {
            this.cast = cast;
        }

        public List<Crew> getCrew() {
            return crew;
        }

        public void setCrew(List<Crew> crew) {
            this.crew = crew;
        }
    }
    
    /**
     * Clases auxiliares para mapear la respuesta de la API.
     */
    static class MovieResponse {
        private List<Movie> results;

        public List<Movie> getResults() {
            return results;
        }

        public void setResults(List<Movie> results) {
            this.results = results;
        }
    }
    
    public Integer fetchMovieRuntime(Integer movieId) {
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;
        ResponseEntity<MovieDetailResponse> response = restTemplate.getForEntity(url, MovieDetailResponse.class);

        if (response.getBody() != null) {
            return response.getBody().getRuntime();
        }
        return null;
    }
    
    static class MovieDetailResponse {
        private Integer runtime;

        public Integer getRuntime() {
            return runtime;
        }

        public void setRuntime(Integer runtime) {
            this.runtime = runtime;
        }
    }

    static class GenreResponse {
        private List<Genre> genres;

        public List<Genre> getGenres() {
            return genres;
        }

        public void setGenres(List<Genre> genres) {
            this.genres = genres;
        }
    }
    
    // Géneros

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
    
    public List<Movie> getMovies(String genre, String letter, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("title"))); // Orden alfabético por defecto

        // Si el usuario solicita un orden específico (por ejemplo, alfabéticamente)
        if (sort != null && sort.equals("alphabetical")) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("title")));
        }

        // Filtro por género y por letra
        if (genre != null && !genre.isEmpty() && letter != null && !letter.isEmpty()) {
            return movieRepository.findByGenres_NameAndTitleStartsWith(genre, letter, pageable);
        } else if (genre != null && !genre.isEmpty()) {
            return movieRepository.findByGenres_Name(genre, pageable);
        } else if (letter != null && !letter.isEmpty()) {
            return movieRepository.findByTitleStartsWith(letter, pageable);
        } else {
            return movieRepository.findAll(pageable).getContent();
        }
    }
}
