import Footer from '../components/Footer';
import Header from '../components/Header';
import HeaderMinimalist from "../components/HeaderMinimalist";
import '../styles/GameInfo.css';
import { useNavigate } from 'react-router-dom';

const GameInfo = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const handleGameInfo = () => {
    navigate('/game');
  };

  return (
    <div className="app">

      {!token ? <HeaderMinimalist /> : <Header />}
      <section className="game-instructions">
        <header className="instructions-header">
          <h2>¿En qué consiste el juego?</h2>
        </header>

        <p className="intro">
          Este juego pone a prueba tus conocimientos de cine. Se te mostrará la <strong>sinopsis de una película</strong> y deberás seleccionar el <strong>título correcto</strong> entre varias opciones. ¡Parece fácil, pero puede ser todo un reto!
        </p>

        <section className="difficulty-section">
          <h3>Modos de dificultad</h3>
          <p>
            Puedes elegir entre <strong>tres niveles de dificultad</strong>, que varían en la cantidad de opciones, la puntuación por acierto y el número total de sinopsis. Aquí te los explicamos:
          </p>

          <article className="difficulty">
            <h4>Fácil</h4>
            <ul>
              <li>3 opciones de títulos.</li>
              <li>1 opción correcta.</li>
              <li>1 punto por acierto.</li>
              <li>5 sinopsis en total.</li>
            </ul>
          </article>

          <article className="difficulty">
            <h4>Medio</h4>
            <ul>
              <li>4 opciones de títulos.</li>
              <li>1 opción correcta.</li>
              <li>2 puntos por acierto.</li>
              <li>10 sinopsis en total.</li>
            </ul>
          </article>

          <article className="difficulty">
            <h4>Difícil</h4>
            <ul>
              <li>5 opciones de títulos.</li>
              <li>1 opción correcta.</li>
              <li>3 puntos por acierto.</li>
              <li>20 sinopsis en total.</li>
            </ul>
          </article>
        </section>

        <section className="score-tracking">
          <h3>Seguimiento de puntuaciones</h3>
          <p>
            Cada usuario podrá consultar su <strong>historial de partidas</strong> y ver su <strong>puntuación acumulada</strong>, así como compararse con el resto de jugadores. ¡Compite por estar en lo más alto del ranking!
          </p>
        </section>
        <button className="game-button" onClick={handleGameInfo}>
          Volver
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default GameInfo;
