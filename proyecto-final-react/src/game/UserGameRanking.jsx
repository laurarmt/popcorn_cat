import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../styles/UserGameRanking.css"
const UserGameRanking = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('none');
  const userId = localStorage.getItem('id');
  const [user, setUser] = useState(null);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 10; 

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/game/user-sessions/${userId}`);
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error('Error al cargar historial:', err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/manage-users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
      }
    };

    if (userId) {
      fetchHistory();
      fetchUser();
    }
  }, [userId]);


  // Filtrar por dificultad
  const filteredSessions = sessions.filter(
    (s) => selectedDifficulty === 'Todas' || s.difficulty === selectedDifficulty
  );

  // Ordenar por porcentaje de aciertos
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortOrder === 'desc') return b.correctCount - a.correctCount; // Más aciertos primero
    if (sortOrder === 'asc') return a.correctCount - b.correctCount;  // Menos aciertos primero
    return 0;
  });

  // Paginación: calcular índices para la página actual
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sortedSessions.slice(indexOfFirstSession, indexOfLastSession);

  // Calcular total de páginas
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);

  // Total de aciertos y errores, los calculamos con filteredSessions (antes de ordenar y paginar)
  const totalCorrectAnswers = filteredSessions.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalIncorrectAnswers = filteredSessions.reduce((acc, curr) => acc + curr.wrongCount, 0);

  // Funciones para cambiar página
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app">
      <Header />
      <div className="historial-container">
        <h2 className="historial-titulo">Historial de mis partidas</h2>

        <div className="historial-info">
          Puntuación total (score): {user?.score ?? 'Cargando...'}
        </div>

        <div className="historial-info">
          Total de aciertos: {totalCorrectAnswers}
        </div>

        <div className="historial-info">
          Total de errores: {totalIncorrectAnswers}
        </div>

        <div className="historial-filtro">
          <label htmlFor="difficulty-filter">Filtrar por dificultad:</label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className="historial-select"
          >
            <option value="Todas">Todas</option>
            <option value="FACIL">Fácil</option>
            <option value="MEDIA">Media</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </div>

        <div className="historial-orden">
          <label htmlFor="order-select">Ordenar resultados:</label>
          <select
            id="order-select"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="historial-select"
          >
            <option value="none">Sin ordenar</option>
            <option value="desc">Mejor a Peor</option>
            <option value="asc">Peor a Mejor</option>
          </select>
        </div>
        <div className="table-wrapper">
        <table className="historial-tabla">
          <thead>
            <tr>
              <th className="historial-th">Número de partida</th>
              <th className="historial-th">Dificultad</th>
              <th className="historial-th">Aciertos</th>
              <th className="historial-th">Errores</th>
              <th className="historial-th">Total</th>
            </tr>
          </thead>
          <tbody>
            {currentSessions.length === 0 ? (
              <tr>
                <td colSpan="5" className="historial-vacio">
                  No hay partidas para esta dificultad
                </td>
              </tr>
            ) : (
              currentSessions.map((s, index) => (
                <tr key={s.sessionId}>
                  <td className="historial-td">{indexOfFirstSession + index + 1}</td>
                  <td className="historial-td">{s.difficulty}</td>
                  <td className="historial-td">{s.correctCount}</td>
                  <td className="historial-td">{s.wrongCount}</td>
                  <td className="historial-td">{s.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
</div>


        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>


      </div>
      <Footer />
    </div>
  );
};


export default UserGameRanking;
