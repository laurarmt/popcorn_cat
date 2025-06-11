import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'
import Header from "../components/Header";
import "../styles/Game.css"
const difficulties = ['FACIL', 'MEDIA', 'DIFICIL'];

const maxQuestionsByDifficulty = {
  FACIL: 5,
  MEDIA: 10,
  DIFICIL: 20,
};

const Game = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [sessionId, setSessionId] = useState(null); // ID de la sesión creada
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState([]);

  const userId = localStorage.getItem('id'); 

  const createSession = async (difficulty) => {
    try {
      const res = await fetch('http://localhost:8080/api/game/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, userId }),
      });

      if (!res.ok) {
        const errorText = await res.text(); // Lee el mensaje de error del backend
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      setSessionId(data.id);

    } catch (error) {
      console.error('Error creando sesión de juego:', error);
    }
  };

  const loadQuestion = async () => {
    if (!difficulty || !sessionId) return;
    if (questionCount >= maxQuestionsByDifficulty[difficulty]) {
      setGameOver(true);
      return;
    }

    setLoading(true);
    setSelected(null);
    setFeedback('');

    try {
      const res = await fetch(`http://localhost:8080/api/game?sessionId=${sessionId}&difficulty=${difficulty}`);
      if (!res.ok) throw new Error('Error al cargar pregunta');
      const data = await res.json();
      setQuestion(data);
      setQuestionCount((prev) => prev + 1);
    } catch (err) {
      setFeedback('Error al cargar la pregunta.');
    }

    setLoading(false);
  };


  useEffect(() => {
    if (difficulty && sessionId) {
      setQuestionCount(0);
      setGameOver(false);
      loadQuestion();
    }
  }, [difficulty, sessionId]);
  useEffect(() => {
    if (gameOver && sessionId) {
      fetch(`http://localhost:8080/api/game/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);

          // Calcular puntuación
          let pointsPerCorrect = 0;
          if (difficulty === 'FACIL') pointsPerCorrect = 1;
          else if (difficulty === 'MEDIA') pointsPerCorrect = 2;
          else if (difficulty === 'DIFICIL') pointsPerCorrect = 3;

          const correctCount = data.filter(r => r.correct).length;
          const totalScore = correctCount * pointsPerCorrect;

          // Actualizar score del usuario
          updateUserScore(totalScore);
        })
        .catch(() => console.error('Error cargando resultados'));
    }
  }, [gameOver, sessionId]);

  const updateUserScore = async (scoreToAdd) => {
    try {
      console.log("UserId para fetch:", userId);
      const res = await fetch(`http://localhost:8080/api/manage-users/${userId}`);
      const user = await res.json();

      const updatedScore = (user.score || 0) + scoreToAdd;

      await fetch(`http://localhost:8080/api/manage-users/${userId}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: updatedScore }),
      });


      console.log(`Score actualizado: +${scoreToAdd} puntos`);
    } catch (err) {
      console.error('Error actualizando score:', err);
    }
  };


  const handleOptionClick = async (option) => {
    setSelected(option);
    const isCorrect = option === question.correctAnswer;

    setFeedback(
      isCorrect
        ? '¡Correcto!'
        : `Incorrecto. La respuesta era: ${question.correctAnswer}`
    );

    try {
      await fetch('http://localhost:8080/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          correct: isCorrect,
          selectedAnswer: option,
          correctAnswer: question.correctAnswer,
        }),
      });
    } catch (error) {
      console.error('Error guardando respuesta:', error);
    }
  };

  const handleDifficultyClick = async (lvl) => {
    if (!difficulty) {
      setDifficulty(lvl);
      await createSession(lvl); // Crea la sesión al iniciar
    }
  };

  const resetGame = () => {
    setDifficulty(null);
    setSessionId(null);
    setQuestion(null);
    setSelected(null);
    setFeedback('');
    setQuestionCount(0);
    setGameOver(false);
  };

  const navigate = useNavigate();
  const handleGameInfo = () => {
    navigate('/game-info');
  };

  return (
    <div className="app">
      <Header />
      <div className="game-container">
        <h2>Adivina la película por la sinopsis</h2>

        <button className="game-button" onClick={handleGameInfo}>¿En qué consiste el juego?</button>

        <div className="game-difficulty">
          <label>Dificultad:</label>
          {difficulties.map(lvl => (
            <button
              key={lvl}
              onClick={() => handleDifficultyClick(lvl)}
              className="game-difficulty-button"
              disabled={!!difficulty}
              style={{
                backgroundColor: difficulty === lvl ? '#00aaff' : '',
                cursor: difficulty ? 'not-allowed' : 'pointer',
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        {!difficulty && <p className="game-message">Por favor, selecciona una dificultad para empezar.</p>}

        {loading && <p className="game-message">Cargando pregunta...</p>}

        {!loading && question && !gameOver && (
          <div className="game-card">
            <p><strong>Sinopsis:</strong></p>
            <p>{question.overview}</p>

            <div className="game-options">
              {question.options.map((option, idx) => {
                const isSelected = selected === option;
                const isCorrect = option === question.correctAnswer;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selected}
                    className={`game-option-button ${isSelected ? (isCorrect ? 'game-option-correct' : 'game-option-incorrect') : ''
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {feedback && <p className="game-feedback">{feedback}</p>}

            {selected && (
              <button onClick={loadQuestion} className="game-next-button">
                Siguiente
              </button>
            )}
          </div>
        )}

        {gameOver && (
          <div className="game-card game-summary">
            <h3>¡Juego terminado!</h3>
            <p>Has respondido las {maxQuestionsByDifficulty[difficulty]} preguntas de la dificultad {difficulty}.</p>

            <h4>Resumen de respuestas:</h4>
            <ul>
              {results.map((r, index) => (
                <li key={index}>
                  <strong>{index + 1}.</strong> Seleccionaste: <em>{r.selectedAnswer}</em> — Respuesta correcta: <em>{r.correctAnswer}</em> — {r.correct ? '✅ Correcto' : '❌ Incorrecto'}
                </li>
              ))}
            </ul>

            <button onClick={resetGame} className="game-next-button">
              Reiniciar Juego
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Game;
