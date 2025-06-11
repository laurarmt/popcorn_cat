import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/MovieDetailsStyles.css';
import Review from "./Review";
import HeaderMinimalist from "../components/HeaderMinimalist";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; 

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);


  const token = localStorage.getItem("token");
useEffect(() => {
  fetch(`http://localhost:8080/api/movies/${id}`)
    .then((response) => response.json())
    .then((data) => setMovie(data))
    .catch((error) => console.error("Error al cargar los detalles de la película:", error));
}, [id]);

  
  const handleGenreClick = (genreName) => {
    navigate(`/movies?genre=${genreName}`); 
  };


  if (!movie) return <p>Cargando...</p>;

  return (
    <div className="app">
      
      {!token ? <HeaderMinimalist /> : <Header />}
      <div className="movie-detail">
        <h1>{movie.title}</h1>
        <div className="movie-main-content"> 
        <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/200"} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <p><strong>Título:</strong> {movie.title}</p>
          <p><strong>Título original:</strong> {movie.original_title}</p>
          <p><strong>Fecha de lanzamiento:</strong> {movie.release_date}</p>
          <p><strong>Idioma original:</strong> {movie.original_language}</p>
          <p><strong>Resumen:</strong> {movie.overview}</p>
          <p><strong>Duración:</strong> {movie.runtime} minutos</p>
          <div className="movie-genres">
            <strong>Géneros:</strong>
            {movie.genres && movie.genres.length > 0 ? (
              <ul className="genres-list">
                {movie.genres.map((genre) => (
                  <li key={genre.id}>
                    <button className="genre-item" onClick={()  => handleGenreClick(genre.name)}>
                      {genre.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay géneros disponibles.</p>
            )}
          </div>
        </div>
        </div>
        <button 
        className="my-reviews-button my-reviews-button-save"
        onClick={() => navigate(`/credits/${movie.id}`)}>Créditos</button>
        
              <Review/>
             
        <button 
        className="my-reviews-button my-reviews-button-save"
        onClick={() => navigate(`/movies`)} >Volver</button>
</div>
      <Footer />
    </div>
  );
};
export default MovieDetail;