import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ReviewsList.css"
const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [movieSearch, setMovieSearch] = useState("");
  const [selectedMovieTitle, setSelectedMovieTitle] = useState("");

  const [nicknameSearch, setNicknameSearch] = useState("");
  const [selectedNickname, setSelectedNickname] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", text: "" });
  const [ratingError, setRatingError] = useState("");
  const [textError, setTextError] = useState("");

  const userId = parseInt(localStorage.getItem("id"), 10);

  useEffect(() => {
    fetch(`http://localhost:8080/api/reviews`)
      .then((response) => {
        if (!response.ok) throw new Error("No se pudieron cargar las reseñas");
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [movieSearch, selectedMovieTitle, nicknameSearch, selectedNickname]);

  const renderStars = (rating) => {
    const stars = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
    return "⭐".repeat(stars[rating] || 0);
  };

  const startEditing = (review) => {
    setEditingReviewId(review.id);
    setEditForm({ rating: review.rating, text: review.text });
    setRatingError("");
    setTextError("");
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditForm({ rating: "", text: "" });
    setRatingError("");
    setTextError("");
  };

  const handleEditSubmit = (reviewId) => {
    if (!editForm.rating) {
      setRatingError("Por favor, selecciona una calificación.");
      return;
    }
    if (!editForm.text.trim()) {
      setTextError("Por favor, escriba una reseña.");
      return;
    }

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar la reseña");
        return res.json();
      })
      .then((updatedReview) => {
        setReviews((prev) => prev.map((r) => (r.id === reviewId ? updatedReview : r)));

      window.location.reload();
        cancelEditing();
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (reviewId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta reseña?")) return;

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar la reseña");
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const uniqueTitles = [...new Set(reviews.map((r) => r.movieTitle).filter(Boolean))];
  const uniqueNicknames = [...new Set(reviews.map((r) => r.nickname).filter(Boolean))];

  const filteredReviews = reviews.filter((review) => {
    const nicknameMatch = selectedNickname
      ? review.nickname?.toLowerCase() === selectedNickname.toLowerCase()
      : review.nickname?.toLowerCase().includes(nicknameSearch.toLowerCase());

    const titleMatch = selectedMovieTitle
      ? review.movieTitle?.toLowerCase() === selectedMovieTitle.toLowerCase()
      : review.movieTitle?.toLowerCase().includes(movieSearch.toLowerCase());

    return nicknameMatch && titleMatch;
  });

  const sortedFilteredReviews = [...filteredReviews].sort((a, b) => {
    const nicknameA = (a.nickname || "").toLowerCase();
    const nicknameB = (b.nickname || "").toLowerCase();
    return nicknameA.localeCompare(nicknameB);
  });
  //Paginado
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  const currentReviews = sortedFilteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedFilteredReviews.length / reviewsPerPage);


  if (loading) return <p>Cargando reseñas...</p>;

  return (
    <div className="app">
      <Header />
      <div className="reviews-container">
  <h2 className="reviews-title">Reseñas de Todos los Usuarios</h2>

  <div className="reviews-filters">
    {/* Autocompletado para película */}
    <div className="autocomplete">
      <input
        type="text"
        className="autocomplete-input"
        placeholder="Buscar por película"
        value={movieSearch}
        onChange={(e) => {
          setMovieSearch(e.target.value);
          setSelectedMovieTitle("");
        }}
      />
      {movieSearch && !selectedMovieTitle && (
        <ul className="suggestions">
          {uniqueTitles
            .filter((title) => title.toLowerCase().includes(movieSearch.toLowerCase()))
            .slice(0, 5)
            .map((title, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setMovieSearch(title);
                  setSelectedMovieTitle(title);
                }}
              >
                {title}
              </li>
            ))}
        </ul>
      )}
    </div>

    {/* Autocompletado para nickname */}
    <div className="autocomplete">
      <input
        type="text"
        className="autocomplete-input"
        placeholder="Buscar por alias"
        value={nicknameSearch}
        onChange={(e) => {
          setNicknameSearch(e.target.value);
          setSelectedNickname("");
        }}
      />
      {nicknameSearch && !selectedNickname && (
        <ul className="suggestions">
          {uniqueNicknames
            .filter((nick) => nick.toLowerCase().includes(nicknameSearch.toLowerCase()))
            .slice(0, 5)
            .map((nick, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setNicknameSearch(nick);
                  setSelectedNickname(nick);
                }}
              >
                {nick}
              </li>
            ))}
        </ul>
      )}
    </div>
  </div>

  {sortedFilteredReviews.length === 0 ? (
    <p className="empty-message">No hay reseñas que coincidan con los filtros.</p>
  ) : (
    <ul className="review-list">
      {currentReviews.map((review) => (
        <li key={review.id} className="review-item">
          <p>
            <strong>Usuario:</strong> {review.nickname || "Usuario desconocido"}
          </p>
          <p>
            <strong>Película:</strong> {review.movieTitle}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(review.createdAt))}
          </p>

          {editingReviewId === review.id ? (
            <>
              <label className="review-label">
                Calificación:
                {ratingError && <p className="error">{ratingError}</p>}
                <select
                  className="select-rating"
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                >
                  <option value="">Selecciona una calificación</option>
                  <option value="ONE">⭐</option>
                  <option value="TWO">⭐⭐</option>
                  <option value="THREE">⭐⭐⭐</option>
                  <option value="FOUR">⭐⭐⭐⭐</option>
                  <option value="FIVE">⭐⭐⭐⭐⭐</option>
                </select>
              </label>
              <br />
              <label className="review-label">
                Reseña:
                {textError && <p className="error">{textError}</p>}
                <textarea
                  className="textarea-comment"
                  value={editForm.text}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                />
              </label>
              <br />
              <button
                className="button button-save"
                onClick={() => handleEditSubmit(review.id)}
              >
                Guardar
              </button>
              <button className="button button-cancel" onClick={cancelEditing}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Calificación:</strong> {renderStars(review.rating)}
              </p>
              <p>
                <strong>Reseña:</strong> {review.text}
              </p>
              {review.userId === userId && (
                <button
                  className="button button-edit"
                  onClick={() => startEditing(review)}
                >
                  Editar
                </button>
              )}
              <button
                className="button button-delete"
                onClick={() => handleDelete(review.id)}
              >
                Eliminar
              </button>
            </>
          )}

          <Link to={`/movies/${review.movieId}`} className="review-link">
            Ver Película
          </Link>
          <hr className="review-separator" />
        </li>
      ))}
    </ul>
  )}
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

      <Footer />
    </div>
  );
};

export default AllReviews;
