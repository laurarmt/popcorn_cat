import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/MoviesStyles.css';
import HeaderMinimalist from "../components/HeaderMinimalist";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const MovieList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);  
  const [filteredMovies, setFilteredMovies] = useState([]);  
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAlphabetVisible, setIsAlphabetVisible] = useState(false);
  const [isGenreVisible, setIsGenreVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const moviesPerPage = 4;

  // Obtener filtros desde la URL
  const selectedLetter = searchParams.get("letter");
  const selectedGenre = searchParams.get("genre");

  useEffect(() => {
    fetch("http://localhost:8080/api/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
      })
      .catch((error) => console.error("Error al cargar las películas:", error));

    fetch("http://localhost:8080/api/genres") 
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error("Error al cargar los géneros:", error));
  }, []);

  useEffect(() => {
    let filtered = [...movies];

    if (selectedLetter) {
      filtered = filtered.filter(movie => movie.title.toUpperCase().startsWith(selectedLetter));
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genres.some(genre => genre.name === selectedGenre));
    }

    if (isAlphabetVisible) {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [selectedLetter, selectedGenre, isAlphabetVisible, movies]);

  const handleLetterClick = (letter) => {
    setSearchParams({ letter, genre: selectedGenre || "" });
  };

  const handleGenreClick = (genre) => {
    setSearchParams({ genre, letter: selectedLetter || "" });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const token = localStorage.getItem("token");
  return (
    <div className="app">
      
      {!token ? <HeaderMinimalist /> : <Header />}
      <div className="filter-container">
      <h1 className="movie-title">Lista de Películas</h1>

      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>Filtros</button>
        {isOpen && (
          <ul className="dropdown-menu">
            <li>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setIsAlphabetVisible(!isAlphabetVisible); setIsGenreVisible(false); }}>
                Alfabéticamente
              </a>
            </li>
            <li>
              <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setIsGenreVisible(!isGenreVisible); setIsAlphabetVisible(false); }}>
                Por Género
              </a>
            </li>
          </ul>
        )}
      </div>

      {selectedLetter || selectedGenre ? (
        <button className="clear-filters-button" onClick={clearFilters}>Limpiar Filtros</button>
      ) : null}

      {isAlphabetVisible && (
        <div className="genre-buttons">
          {ALPHABET.map((letter) => (
            <button key={letter} className={`genre-item ${selectedLetter === letter ? 'selected' : ''}`} onClick={() => handleLetterClick(letter)}>
              {letter}
            </button>
          ))}
        </div>
      )}

      {isGenreVisible && (
        <div className="genre-buttons">
          {genres.map((genre) => (
            <button key={genre.id} className={`genre-item ${selectedGenre === genre.name ? 'selected' : ''}`} onClick={() => handleGenreClick(genre.name)} >
              {genre.name}
            </button>
          ))}
        </div>
      )}
</div>
      {filteredMovies.length === 0 ? (
        <p className="loading-text">No hay películas disponibles.</p>
      ) : (
        <ul className="movie-list">
          {currentMovies.map((movie) => (
            <li className="movie-item" key={movie.id}>
              <h2 className="movie-title">{movie.title}</h2>
              <img
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/200"}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <p><strong>Fecha de lanzamiento:</strong> {movie.release_date}</p>
                <p><strong>Duración:</strong> {movie.runtime} minutos</p>
                <div className="movie-genres">
                  <strong>Géneros:</strong>
                  {movie.genres && movie.genres.length > 0 ? (
                    <ul className="genres-list">
                      {movie.genres.map((genre) => (
                        <li key={genre.id}>
                          <button className="genre-item" onClick={() => handleGenreClick(genre.name)}> {genre.name} </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay géneros disponibles.</p>
                  )}
                </div>
                <button className="movie-info-boton" onClick={() => navigate(`/movies/${movie.id}`)}>Más información</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente</button>
      </div>

      <Footer />
    </div>
  );
};

export default MovieList;
