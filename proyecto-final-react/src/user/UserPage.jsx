
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer'
import Header from "../components/Header";
import '../styles/UserPage.css';
import { useNavigate } from 'react-router-dom';

function UserPage() {
    const [user, setUser] = useState(null); 
    const [editForm, setEditForm] = useState(null);
    const [error, setError] = useState(null); 
    const userId = localStorage.getItem('id'); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!userId || !token) {
            setError("No se encontró ID o token de usuario.");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/manage-users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setUser(response.data);
                } else {
                    setError("Datos del usuario no encontrados.");
                }
            } catch (err) {
                setError("Error al obtener los datos del usuario.");
            }
        };

        fetchUserData();
    }, [userId, token]);

    // Manejar la edición del usuario
    const handleEdit = () => {
        setEditForm({
            ...user, 
            password: '', 
        });
    };

    const handleChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    // Guardar los cambios
    const handleSave = async (e) => {
        e.preventDefault();
        setError(""); 
    
        try {
            const updatedUser = { ...editForm };
            delete updatedUser.reviews; 
    
            if (editForm.password.trim()) {
                updatedUser.password = editForm.password; 
            }
    
            await axios.put(`http://localhost:8080/api/manage-users/${user.id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(updatedUser); 
            setEditForm(null);
        } catch (err) {
            setError("Error al guardar los cambios.");
        }
    };
    

    // Cancelar la edición y cerrar el formulario
    const handleCancel = () => {
        setEditForm(null); 
    };

    //Eliminar el usuario
    const navigate = useNavigate(); // Para redireccionar

const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:8080/api/manage-users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.clear(); 
        navigate("/"); 
    } catch (err) {
        setError("Error al eliminar la cuenta.");
    }
};


    return (
        <div className="app">
            <Header />
            <div className="user-info-container">
                <h2 className='titles'>Información del Usuario</h2>

                {error && <p className="error-message">{error}</p>}

                {user && !editForm ? (
                    <div>
                        <p><strong>ID:  </strong> {user.id}</p>
                        <p><strong>Alias:  </strong> {user.nickname}</p>
                        <p><strong>Nombre:  </strong> {user.name}</p>
                        <p><strong>Apellido:  </strong> {user.surname}</p>
                        <p><strong>Correo:  </strong> {user.email}</p>
                        <p><strong>Fecha de Nacimiento:  </strong> {user.birthDate}</p>
                        <p><strong>Rol:  </strong> {user.rol === "ADMIN" ? "Administrador" : "Usuario"}</p> 

                        <div className='button-continer'>
                            <button onClick={handleEdit} className="login-button">Editar datos</button>
                            <button onClick={handleDelete} className="cancel-button">Eliminar cuenta</button>
                        </div>

                    </div>
                ) : editForm ? (
                    <form onSubmit={handleSave} className='form-edit-user'>
                        <h2>Editar Información</h2>
                        <div>
                            <label >Alias:  </label>
                            <input type="text" name="nickname" value={editForm.nickname} onChange={handleChange} required className='input-field'/>
                        </div>
                        <div>
                            <label >Nombre:  </label>
                            <input type="text" name="name" value={editForm.name} onChange={handleChange} required className='input-field'/>
                        </div>
                        <div>
                            <label>Apellido:  </label>
                            <input type="text" name="surname" value={editForm.surname} onChange={handleChange} required className='input-field' />
                        </div>
                        <div>
                            <label >Correo:  </label>
                            <input type="email" name="email" value={editForm.email} onChange={handleChange} required className='input-field'/>
                        </div>
                        <div>
                            <label>Fecha de Nacimiento:  </label>
                            <input type="date" name="birthDate" value={editForm.birthDate} onChange={handleChange} required className='input-field'/>
                        </div>
                        
                        <div>
                            <label>Nueva Contraseña (opcional):  </label>
                            <input type="password" name="password" value={editForm.password} onChange={handleChange}  className='input-field'/>
                        </div>
                        <div className='button-continer'>
                            <button type="submit" className='login-button'>Guardar Cambios</button>
                            <button type="button" onClick={handleCancel} className='cancel-button'>Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <p>Cargando datos del usuario...</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default UserPage;
