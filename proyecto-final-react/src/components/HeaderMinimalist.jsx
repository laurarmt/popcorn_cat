import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useState } from "react";

function HeaderMinimalist() {

// Obtener la ruta actual
const location = useLocation(); 
const isRegisterPage = location.pathname === '/user-register';
const isLoginPage = location.pathname === '/user-login';

const [src, setSrc] = useState("/logo1.png");
const navigate = useNavigate();

  return (
    <header className="header-navigation">
      <nav>
        <ul className="nav-links">
          <div className="nav-items-left">
            <img src={src} alt="Imagen Hover" width="80" height="80" title='Inicio' onMouseOver={() => setSrc("/logo2.png")} onMouseOut={() => setSrc("/logo1.png")}
            onClick={() => navigate("/")} style={{ cursor: "pointer", transition: "0.3s" }} />
          </div>
          <div className="nav-items-right">
          <li className="nav-item">
            <Link to="/movies" className="nav-link">Películas</Link>
          </li>
            {!(isRegisterPage || isLoginPage) && (
              <>
                <li className="nav-item" style={{ marginLeft: "10px" }}>
                  <Link to="/user-register" className="btn link-register">Registrarse</Link>
                </li>
                <li className="nav-item" style={{ marginLeft: "10px" }}>
                  <Link to="/user-login" className="btn nav-link" >Iniciar Sesión</Link>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}
export default HeaderMinimalist;