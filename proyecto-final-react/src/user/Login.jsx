import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer'
import HeaderMinimalist from '../components/HeaderMinimalist'
import '../styles/LoginStyles.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:8080/api/manage-users/login", { email, password });

        console.log("Respuesta del servidor:", response.data); 

        if (response.data.status === "success" && response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role); 
            localStorage.setItem("id", response.data.id); 

            window.location.href = "/"; 
        } else {
            alert(response.data.message || "Error en el inicio de sesión");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error.response?.data || error.message); 
        alert("Error en la solicitud. Por favor, intenta de nuevo.");
    }
};



  return (
      <div className="body-container, app">
        <HeaderMinimalist/>
          <div className="login-wrapper">
              <div className="login-image-container">
                  <img src="/imgLogin.jpg" alt="Login" className="login-image" />
              </div>
              <div className="login-form-container">
                  <h2 className="titles">Iniciar Sesión</h2>
                  <form onSubmit={handleLogin} className="login-form">
                      <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field"/>
                      <br /><br />
                      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field"/>
                      <br /><br />
                      <button type="submit" className="login-button">Iniciar sesión</button>
                  </form>
                  <br /><br />
                  <div>
                      <p>¿No tienes cuenta? <a href="/user-register" className="signup-link">Regístrate aquí</a></p>
                  </div>
              </div>
          </div>
          <Footer/>
      </div>
  );
};
  
  export default Login;