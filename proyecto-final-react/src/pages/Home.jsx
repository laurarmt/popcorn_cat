import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import Footer from '../components/Footer';
import '../styles/HomeStyles.css';
import HeaderMinimalist from "../components/HeaderMinimalist";
import Header from "../components/Header";

const Home = () => {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState([]);  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch("http://localhost:8080/api/movies");
      const data = await response.json();
      setMovies(data);
    };

    fetchMovies();
  }, []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [visibleCount, setVisibleCount] = useState(4); // por defecto en el ordenador
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize(); // llama una vez al inicio
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (windowWidth <= 768) {
      setVisibleCount(1); // móvil
    } else if (windowWidth <= 1024) {
      setVisibleCount(2); // tablet
    } else {
      setVisibleCount(4); // ordenador
    }
  }, [windowWidth]);
  
  const nextSlide = () => {
    if (currentIndex + visibleCount < movies.length) {
      setCurrentIndex(currentIndex + visibleCount);
    }
  };
  
  const prevSlide = () => {
    if (currentIndex - visibleCount >= 0) {
      setCurrentIndex(currentIndex - visibleCount);
    }
  };
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4 >= movies.length ? 0 : prev + 4));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [movies.length]);

  return (
    <div className='app'>
        {!token ? <HeaderMinimalist /> : <Header />}


        <div className="carousel">
          <button className="carousel-btn left" onClick={prevSlide}>❮</button>
          
          <div className="carousel-container">
          {movies.slice(currentIndex, currentIndex + visibleCount).map((movie) => (
 
            <Link 
            key={movie.id} 
            to={`/movies/${movie.id}`}
          >
          
              <img
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/200"}
                alt={`Poster de ${movie.title}`}
                className="active"
              />
            </Link>
          ))}
        </div>

          <button className="carousel-btn right" onClick={nextSlide}>❯</button>
        </div>
        
        <Footer />
    </div>
  );
};

export default Home;