import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from '../components/Footer'
import HeaderMinimalist from '../components/HeaderMinimalist'
import '../styles/RegisterStyles.css';

const Register = () => {
    const navigate = useNavigate();
    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const [form, setForm] = useState({
        nickname: "",
        name: "",
        surname: "",
        email: "",
        birthDate: "",
        password: "",
        acceptPrivacity: false
    });

    const [error, setError] = useState("");

    // Manejar cambios en los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (
            form.name.trimStart() !== form.name ||
            form.surname.trimStart() !== form.surname ||
            form.email.trimStart() !== form.email ||
            form.birthDate.trimStart() !== form.birthDate ||
            form.nickname.trimStart() !== form.nickname
        ) {
            setError("No puede haber espacios en blanco al inicio de los campos.");
            return;
        }
        if (!emailRule.test(form.email)) {
            setError("El correo electrónico no es válido.");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/api/manage-users/register", form);

            if (response.data.status === "success") {
                localStorage.setItem("token", response.data.token);
                navigate("/user-login");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Hubo un error al registrar el usuario.");
            console.error(err);
        }
    };

    return (

        <div className="body-container, app">
            <HeaderMinimalist />
            <div className="login-wrapper">
                <div className="login-image-container">
                    <img src="/imgRegister.jpg" alt="Login" className="login-image" />
                </div>
                <div className="login-form-container">
                    <h2 className="titles">Crear una cuenta</h2>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <input type="text" name="nickname" placeholder="Alias" value={form.nickname} onChange={handleChange} required className="input-field" />
                        <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required className="input-field" />
                        <input type="text" name="surname" placeholder="Apellido" value={form.surname} onChange={handleChange} required className="input-field" />
                        <input type="email" name="email" placeholder="Correo Electrónico" value={form.email} onChange={handleChange} required className="input-field" />
                        <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required className="input-field" />
                        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="input-field" />
                        <br></br>
                        <div className="checkbox-container">
                            <div className="checkbox-container">
                                <label className="custom-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={form.acceptPrivacity}
                                        onChange={(e) => setForm({ ...form, acceptPrivacity: e.target.checked })}
                                        required
                                        className="custom-checkbox"
                                    />
                                    Acepto la <Link to="/privacity" className="privacy-link">Política de privacidad</Link>
                                </label>
                            </div>

                        </div>
                        <button type="submit" className="login-button">Registrarse</button>
                    </form>
                    <br></br>
                    <div className="signup-div">
                        <p>¿Ya tienes una cuenta? <a href="/user-login" className="signup-link">Inicia sesión</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;