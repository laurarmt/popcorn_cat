import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';
//import 'bootstrap/dist/css/bootstrap.min.css';  // CSS de Bootstrap
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // JS de Bootstrap



function Header() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [src, setSrc] = useState("/logo1.png");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    if (token) {
      axios.get("http://localhost:8080/home", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          console.log("Datos del servidor:", response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        });
    } else {
      console.log("No se encontró el token de autenticación.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/");
  };



  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  

  return (
    <header className="header-navigation">
  <nav>
    <button className="hamburger" onClick={toggleMobileMenu}>☰</button>

    <div className={`nav-links-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
      <ul className="nav-links">
        <li>
          <img
            src={src}
            alt="Imagen Hover"
            width="80"
            height="80"
            title="Inicio"
            onMouseOver={() => setSrc("/logo2.png")}
            onMouseOut={() => setSrc("/logo1.png")}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", transition: "0.3s" }}
          />
        </li>
        <li className="nav-item"><Link to="/movies" className="nav-link">Películas</Link></li>
        <li className="nav-item"><Link to="/my-reviews" className="nav-link">Mis reseñas</Link></li>
        <li className="nav-item"><Link to="/movies-comparator" className="nav-link">Comparar</Link></li>

      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('juego')}>Juego</button>
        {openDropdown === 'juego' && (
          <ul className="dropdown-menu">
            <li className="nav-item"><Link to="/game" className="nav-link">Juego</Link></li>
            <li className="nav-item"><Link to="/mi-ranking" className="nav-link">Mi ranking</Link></li>
            <li className="nav-item"><Link to="/ranking-general" className="nav-link">Ranking general</Link></li>
          </ul>
        )}
      </div>

      {role === 'ADMIN' && (
        <div className="dropdown">
          <button className="dropdown-toggle" onClick={() => toggleDropdown('gestion')}>Gestión</button>
          {openDropdown === 'gestion' && (
            <ul className="dropdown-menu">
              <li className="nav-item"><Link to="/user-management" className="nav-link">Gestión usuarios</Link></li>
              <li className="nav-item"><Link to="/reviews" className="nav-link">Gestión reseñas</Link></li>
            </ul>
          )}
        </div>
      )}

      <div className="dropdown">
        <button className="dropdown-toggle" onClick={() => toggleDropdown('account')}>
          <img src="/account_box.svg" alt="Dropdown icon" width="24" height="24" />
        </button>
        {openDropdown === 'account' && (
          <ul className="dropdown-menu right-aligned">
            <li><Link to="/user-page" className="dropdown-item">Mi usuario</Link></li>
            <li><a href="#" onClick={handleLogout} className="dropdown-item">Cerrar Sesión</a></li>
          </ul>
        )}
      </div>
      </ul>

    </div>
  </nav>
</header>

  );
}

export default Header;
