import React, { useEffect, useState } from "react";
import axios from "axios";

import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/GameRanking.css"

function GameRanking() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchAlias, setSearchAlias] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;

  useEffect(() => {
    axios.get("http://localhost:8080/api/game/summary")
      .then(response => {
        // Ordenar players por score de mayor a menor y asignar posición original
        const sortedPlayers = response.data
          .sort((a, b) => b.score - a.score)
          .map((player, index) => ({
            ...player,
            position: index + 1,  // posición fija original
          }));
        setPlayers(sortedPlayers);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  }, []);

  // Filtrar jugadores por alias
  const filteredPlayers = players.filter(player =>
    player.nickname.toLowerCase().includes(searchAlias.toLowerCase())
  );

  // Ordenar según sortOrder
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortOrder === "asc") return a.score - b.score;
    if (sortOrder === "desc") return b.score - a.score;
    return 0;
  });
  //Paginado
  const totalPages = Math.ceil(sortedPlayers.length / playersPerPage);

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;

  const currentPlayers = sortedPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <Header />
      <div className="ranking-general-container">

        <h2 className="legal-title">Ranking general de los usuarios</h2>
        <div className="players-controls">
          <input
            type="text"
            placeholder="Filtrar por alias"
            value={searchAlias}
            onChange={e => setSearchAlias(e.target.value)}
            className="players-input"
          />

          <label htmlFor="sortOrder" className="players-label">Ordenar por puntuación: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="players-select"
          >
            <option value="desc">Mejor a Peor</option>
            <option value="asc">Peor a Mejor</option>
          </select>
        </div>
        <div className="table-wrapper">
        <table className="players-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th className="players-th">Posición</th>
              <th className="players-th">Alias</th>
              <th className="players-th">Número de partidas jugadas</th>
              <th className="players-th">Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.length === 0 ? (
              <tr>
                <td colSpan="4" className="players-empty">
                  No se encontraron jugadores con ese alias.
                </td>
              </tr>
            ) : (
              currentPlayers.map((player) => (
                <tr key={player.nickname}>
                  <td className="players-td">{player.position}</td>
                  <td className="players-td">{player.nickname}</td>
                  <td className="players-td">{player.gamesPlayed}</td>
                  <td className="players-td">{player.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="pagination" style={{ marginTop: "1rem" }}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default GameRanking;
