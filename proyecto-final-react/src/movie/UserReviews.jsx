import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/UserReviews.css"

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = parseInt(localStorage.getItem("id"), 10);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", text: "" });
  const [ratingError, setRatingError] = useState("");
  const [textError, setTextError] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterText, setFilterText] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    fetch(`http://localhost:8080/api/reviews/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar las reseñas del usuario");
        }
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
  }, [userId]);

  //Editar
  const handleEditSubmit = (reviewId) => {
    // Validación
    if (!editForm.rating) {
      setRatingError("Por favor, selecciona una calificación.");
      return;
    } else {
      setRatingError("");
    }

    if (!editForm.text.trim()) {
      setTextError("Por favor, escriba una reseña.");
      return;
    } else {
      setTextError("");
    }

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: editForm.rating,
        text: editForm.text,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al actualizar la reseña");
      }
      return res.json();
    })
    .then(() => {
      window.location.reload();
    })
      .catch((error) => {
        console.error(error);
      });
  };

  //Eliminar
  const handleDelete = (reviewId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta reseña?")) return;

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al eliminar la reseña");
        }
        // Actualizar lista localmente
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const renderStars = (rating) => {
    const stars = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
    };
    return "⭐".repeat(stars[rating] || 0);
  };
  const filteredReviews = reviews.filter((review) => {
    const titleMatch = review.movieTitle?.toLowerCase().includes(filterTitle.toLowerCase());
    const textMatch = review.text?.toLowerCase().includes(filterText.toLowerCase());
    return titleMatch && textMatch;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  if (loading) return <p>Cargando tus reseñas...</p>;

  return (
    <div className="app">
      <Header />

      <div className="my-reviews-container">
        <h2 className="my-reviews-title">Mis Reseñas</h2>
        <div className="my-reviews-filters">
          <input
            type="text"
            className="my-reviews-filter-input"
            placeholder="Filtrar por título de película"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </div>

        {filteredReviews.length === 0 ? (
          <p className="my-reviews-empty-message">No has realizado ninguna reseña aún.</p>
        ) : (
          <ul className="my-reviews-list">
            {currentReviews.map((review) => (
              <li key={review.id} className="my-reviews-item">
                <p className="my-reviews-movie-title"><strong>Película:</strong> {review.movieTitle}</p>
                <p className="my-reviews-date">
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
                    <label className="my-reviews-label">
                      Calificación:
                      {ratingError && <p className="my-reviews-error">{ratingError}</p>}
                      <select
                        className="my-reviews-select"
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rating: e.target.value })
                        }
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
                    <label className="my-reviews-label">
                    Reseña:
                      {textError && <p className="my-reviews-error">{textError}</p>}
                      <textarea
                        className="my-reviews-textarea"
                        value={editForm.text}
                        onChange={(e) =>
                          setEditForm({ ...editForm, text: e.target.value })
                        }
                      />
                    </label>
                    <br />
                    <button
                      className="my-reviews-button my-reviews-button-save"
                      onClick={() => handleEditSubmit(review.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="my-reviews-button my-reviews-button-cancel"
                      onClick={cancelEditing}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <p className="my-reviews-rating"><strong>Calificación:</strong> {renderStars(review.rating)}</p>
                    <p className="my-reviews-comment"><strong>Reseña:</strong> {review.text}</p>
                    <button
                      className="my-reviews-button my-reviews-button-edit"
                      onClick={() => startEditing(review)}
                    >
                      Editar
                    </button>
                    <button
                      className="my-reviews-button my-reviews-button-delete"
                      onClick={() => handleDelete(review.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}

                <Link to={`/movies/${review.movieId}`} className="my-reviews-link">
                  Ver Película
                </Link>
                <hr className="my-reviews-separator" />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default UserReviews;
