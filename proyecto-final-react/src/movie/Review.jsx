import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Reviews.css"

const Review = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", text: "" });
  const [createErrors, setCreateErrors] = useState({ rating: "", text: "" });
  const [editErrors, setEditErrors] = useState({ rating: "", text: "" });
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewData, setEditReviewData] = useState({ rating: "", text: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [originalReviews, setOriginalReviews] = useState([]);

  const [selectedRating, setSelectedRating] = useState("Todas");
  const [sortBy, setSortBy] = useState("none");
  const [sortOrder, setSortOrder] = useState("desc");

  const userId = parseInt(localStorage.getItem("id"), 10);
  const userRole = localStorage.getItem("role");
  const ratingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  const totalReviews = originalReviews.length;



  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const token = localStorage.getItem("token");

  const sumRatings = originalReviews.reduce((sum, review) => {
    return sum + (ratingMap[review.rating] || 0);
  }, 0);

  const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(2) : 0;


  const validateReviewInput = (review, setErrors) => {
    let isValid = true;

    if (!review.rating) {
      setErrors((prev) => ({ ...prev, rating: "Por favor, selecciona una calificación." }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }

    if (!review.text.trim()) {
      setErrors((prev) => ({ ...prev, text: "Por favor, escriba una reseña." }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, text: "" }));
    }

    return isValid;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error al cargar los detalles de la película:", error));

    fetch(`http://localhost:8080/api/reviews/movie/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar las reseñas");
        return response.json();
      })
      .then((data) => {
        const sorted = [
          ...data.filter((r) => r.userId === userId),
          ...data.filter((r) => r.userId !== userId),
        ];
        setReviews(sorted);
        setOriginalReviews(sorted);
      })
      .catch((error) => console.error("Error al cargar las reseñas:", error));
  }, [id, userId]);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRating, sortBy, sortOrder]);


  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!validateReviewInput(newReview, setCreateErrors)) return;

    fetch("http://localhost:8080/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("id"),
        movieId: id,
        rating: newReview.rating,
        text: newReview.text,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews((prevReviews) => [...prevReviews, data]);
        setNewReview({ rating: "", text: "" });
        setSuccessMessage("¡Reseña enviada correctamente!");
        window.location.reload();
      })
      .catch((error) => console.error("Error al agregar la reseña:", error));
  };

  const handleEditSubmit = (event, reviewId) => {
    event.preventDefault();

    if (!validateReviewInput(editReviewData, setEditErrors)) return;

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: editReviewData.rating,
        text: editReviewData.text,
      }),
    })
      .then((response) => response.json())
      .then((updatedReview) => {
        setReviews((prevReviews) =>
          prevReviews.map((r) => (r.id === reviewId ? updatedReview : r))
        );
        setEditingReview(null);
        window.location.reload();
      })
      .catch((error) => console.error("Error al actualizar la reseña:", error));
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta reseña?")) return;

    fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
          window.location.reload();
        } else {
          throw new Error("Error al eliminar la reseña");
        }
      })
      .catch((error) => console.error("Error:", error));
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

  const userHasReview = reviews.some((review) => review.userId === userId);

  const ratingCount = {
    ONE: 0,
    TWO: 0,
    THREE: 0,
    FOUR: 0,
    FIVE: 0,
  };

  originalReviews.forEach((review) => {
    if (ratingCount[review.rating] !== undefined) {
      ratingCount[review.rating]++;
    }
  });

  let baseReviews = sortBy === "none" ? originalReviews : [...reviews];
  let filteredReviews = selectedRating === "Todas"
    ? baseReviews
    : baseReviews.filter((r) => r.rating === selectedRating);

  if (sortBy !== "none") {
    filteredReviews.sort((a, b) => {
      if (sortBy === "rating") {
        const ratingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
        const ratingA = ratingMap[a.rating] || 0;
        const ratingB = ratingMap[b.rating] || 0;
        return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
      } else if (sortBy === "date") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  }

  //Paginado
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage));

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  
  


  if (!movie) return <p>Cargando reseñas...</p>;

  return (
    <div className="container-general-reviews">
      {successMessage && <p className="success-message">{successMessage}</p>}

      

      <h3 className="my-reviews-title">Calificaciones</h3>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <p><strong>Media de calificaciones:</strong> {averageRating} ⭐</p>
          <p><strong>Número total de reseñas:</strong> {totalReviews}</p>

          <h4>Resumen de reseñas por calificación:</h4>
          <ul style={{ listStyleType: "none" }}>
            <li>⭐⭐⭐⭐⭐ ({ratingCount.FIVE})</li>
            <li>⭐⭐⭐⭐ ({ratingCount.FOUR})</li>
            <li>⭐⭐⭐ ({ratingCount.THREE})</li>
            <li>⭐⭐ ({ratingCount.TWO})</li>
            <li>⭐ ({ratingCount.ONE})</li>
          </ul>
        </div>
        </div>



        {token && !userHasReview && (
        <>
        
          <h3 className="my-reviews-title2">Agregar una reseña</h3>
          <form onSubmit={handleReviewSubmit}>
            <label className="my-reviews-label2">
              Calificación:
              {createErrors.rating && <p className="error">{createErrors.rating}</p>}
              <select
              className="my-reviews-select"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
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
            <label  className="my-reviews-label2">
              Reseña:
              {createErrors.text && <p className="error">{createErrors.text}</p>}
              <textarea
              className="my-reviews-textarea"
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              />
            </label>
            <br />
            <button 
            className="my-reviews-button my-reviews-button-save"
            type="submit">Enviar reseña</button>
          </form>
        </>
      )}



      <div className="review-review-container">
      <h3 className="my-reviews-title2">Reseñas</h3>

        <label htmlFor="rating-filter" className="review-controls-label"><strong>Filtrar por calificación:</strong></label>
        <select
          id="rating-filter"    className="review-controls-select"

          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
        >
          <option value="Todas">Todas</option>
          <option value="ONE">⭐</option>
          <option value="TWO">⭐⭐</option>
          <option value="THREE">⭐⭐⭐</option>
          <option value="FOUR">⭐⭐⭐⭐</option>
          <option value="FIVE">⭐⭐⭐⭐⭐</option>
        </select>

        <label htmlFor="sort-by"  className="review-controls-label"><strong>Ordenar por:</strong></label>
        <select
          id="sort-by"   
           className="review-controls-select"

          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">Sin ordenar</option>
          <option value="rating">Calificación</option>
          <option value="date">Fecha</option>
        </select>

        <label htmlFor="sort-order"  className="review-controls-label"><strong>Orden:</strong></label>
        <select
          id="sort-order"
          className="review-controls-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
   
        >
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </div>

      {currentReviews.length > 0 ? (
        <ul className="my-reviews-list">
          {currentReviews.map((review) => (
            <li key={review.id} className="my-reviews-item">
              <p className="my-reviews-movie-title"><strong>Usuario:</strong> {review.nickname || "Anónimo"}</p>
              <p className="my-reviews-date"><strong>Fecha:</strong> 
              {new Intl.DateTimeFormat("es-ES", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
              }).format(new Date(review.createdAt))}
              </p>

              {editingReview === review.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, review.id)}>
                  <label className="my-reviews-label2">
                    Calificación:
                    {editErrors.rating && <p className="error">{editErrors.rating}</p>}
                    <select
                    className="my-reviews-select"
                      value={editReviewData.rating}
                      onChange={(e) => setEditReviewData({ ...editReviewData, rating: e.target.value })}
                    >
                      <option value="ONE">⭐</option>
                      <option value="TWO">⭐⭐</option>
                      <option value="THREE">⭐⭐⭐</option>
                      <option value="FOUR">⭐⭐⭐⭐</option>
                      <option value="FIVE">⭐⭐⭐⭐⭐</option>
                    </select>
                  </label>
                  <br />
                  <label className="my-reviews-label2">
                    Reseña:
                    {editErrors.text && <p className="error">{editErrors.text}</p>}
                    <textarea

                      className="my-reviews-textarea"
                      value={editReviewData.text}
                      onChange={(e) => setEditReviewData({ ...editReviewData, text: e.target.value })}
                    />
                  </label>
                  <br />
                  <button
                      className="my-reviews-button my-reviews-button-save"
                       type="submit">Guardar
                       </button>
                  <button 
                  type="button" 
                      className="my-reviews-button my-reviews-button-cancel"
                       onClick={() => setEditingReview(null)}>Cancelar</button>
                </form>
              ) : (
                <>
                  <p  className="my-reviews-rating"><strong>Calificación:</strong> {renderStars(review.rating)}</p>
                  <p className="my-reviews-comment"><strong>Reseña:</strong> {review.text}</p>

                  {review.userId === userId && (
                    <button 
                    className="my-reviews-button my-reviews-button-edit"
                    onClick={() => {
                      setEditingReview(review.id);
                      setEditReviewData({ rating: review.rating, text: review.text });
                    }}>
                      Editar
                    </button>
                  )}

                  {(review.userId === userId || userRole === "ADMIN") && (
                   
                      <button
                      className="my-reviews-button my-reviews-button-delete"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Eliminar
                      </button>
                    
                  )}
                </>

              )}
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reseñas aún.</p>
      )}


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
    </div>
  );
};

export default Review;