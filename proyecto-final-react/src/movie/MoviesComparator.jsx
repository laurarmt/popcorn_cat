import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/MoviesComparator.css';

export default function MovieComparator() {
  const [peliculas, setPeliculas] = useState([]);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);
  const [comparacion, setComparacion] = useState(null);

  // Carga todas las películas al iniciar
  useEffect(() => {
    axios.get("http://localhost:8080/api/movies")
      .then(res => setPeliculas(res.data))
      .catch(console.error);
  }, []);

  // Filtra películas para autocompletado
  const filterPeliculas = (query) => {
    if (!query) return [];
    return peliculas.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // max 5 sugerencias
  };

  // Maneja selección para input1
  const handleSelect1 = (movie) => {
    setSelected1(movie);
    setSearch1(movie.title);
  };

  // Maneja selección para input2
  const handleSelect2 = (movie) => {
    setSelected2(movie);
    setSearch2(movie.title);
  };

  // Comparar películas cuando estén seleccionadas y distintas
  const handleComparar = () => {
    if (!selected1 || !selected2) {
      alert("Selecciona dos películas para comparar");
      return;
    }
    if (selected1.id === selected2.id) {
      alert("Selecciona dos películas diferentes");
      return;
    }

    axios.get(`http://localhost:8080/api/movies/compare?id1=${selected1.id}&id2=${selected2.id}`)
      .then(res => setComparacion(res.data))
      .catch(err => alert("Error al obtener comparación"));
  };

  return (
    <div className="app">
      <Header />

      <div className="content-wrapper">
        <h2 className="movie-title">Comparador de Películas</h2>

        <div className="search-container">


          <div className="search-container">
            <div className="search-box">
              <input
                className="search-input"
                type="text"
                placeholder="Buscar película 1"
                value={search1}
                onChange={e => {
                  setSearch1(e.target.value);
                  setSelected1(null);
                }}
              />
              {search1 && !selected1 && (
                <ul className="suggestions">
                  {filterPeliculas(search1).map(movie => (
                    <li
                      key={movie.id}
                      onClick={() => handleSelect1(movie)}
                    >
                      {movie.title} ({movie.release_date?.slice(0, 4)})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* VS en medio */}
            <div className="vs-label">VS</div>

            <div className="search-box">
              <input
                className="search-input"
                type="text"
                placeholder="Buscar película 2"
                value={search2}
                onChange={e => {
                  setSearch2(e.target.value);
                  setSelected2(null);
                }}
              />
              {search2 && !selected2 && (
                <ul className="suggestions">
                  {filterPeliculas(search2).map(movie => (
                    <li
                      key={movie.id}
                      onClick={() => handleSelect2(movie)}
                    >
                      {movie.title} ({movie.release_date?.slice(0, 4)})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>

        <button onClick={handleComparar} className="compare-button">
          Comparar
        </button>

        {comparacion && (
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Atributo</th>
                <th>{comparacion.movie1.title}</th>
                <th>{comparacion.movie2.title}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Géneros</td>
                <td>{comparacion.movie1.genres.map(g => g.name).join(", ")}</td>
                <td>{comparacion.movie2.genres.map(g => g.name).join(", ")}</td>
              </tr>
              <tr>
                <td>Duración</td>
                <td>{comparacion.movie1.runtime} min</td>
                <td>{comparacion.movie2.runtime} min</td>
              </tr>
              <tr>
                <td>Año estreno</td>
                <td>{comparacion.movie1.release_date?.slice(0, 4)}</td>
                <td>{comparacion.movie2.release_date?.slice(0, 4)}</td>
              </tr>
              <tr>
                <td>Número de reseñas</td>
                <td>{comparacion.movie1.reviews.length}</td>
                <td>{comparacion.movie2.reviews.length}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </div>

  );
}
