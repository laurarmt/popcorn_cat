import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import '../styles/UserManagementStyles.css';


const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
 const [form, setForm] = useState({
  nickname: "",
  name: "",
  surname: "",
  email: "",
  password: "",
  birthDate: "",
  rol: "USER",
  acceptPrivacity: false
});

  const [editForm, setEditForm] = useState(null);
  const [error, setError] = useState("");

  const userId = Number(localStorage.getItem("id"));
  const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


  
  // Paginado
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Contador de administradores
  const [adminCount, setAdminCount] = useState(0);

  // Obtener usuarios con paginación
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/manage-users?page=${page}&size=10`);
      const usersData = response.data.content || [];

      // Contar cuántos administradores hay
      const adminUsers = usersData.filter(user => user.rol === "ADMIN").length;
      
      setUsers(usersData);
      setTotalPages(response.data.totalPages || 0);
      setAdminCount(adminUsers); // Actualizar cantidad de admins
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsers([]);
      setTotalPages(0);
      setAdminCount(0);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, page]);

  // Crear usuario
  const handleCreate = async (e) => {
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
    // Validación de email
    if (!emailRule.test(form.email)) {
      setError("El correo electrónico no es válido.");
      return;
    }

  
    try {
      const response = await axios.post("http://localhost:8080/api/manage-users", form);
  
      if (response.data.status === "error") {
        setError(response.data.message || "Error al crear el usuario.");
        return;
      }
  
      // Éxito
      setForm({
        nickname: "",
        name: "",
        surname: "",
        email: "",
        password: "",
        birthDate: "",
        rol: "USER",
        acceptPrivacity: false
      });
      
      setPage(0);
      await fetchUsers(); 
    } catch (err) {
      setError("Error del servidor al crear el usuario.");
    }
  };
  

  // Activar modo edición
  const handleEdit = (user) => {
    setEditForm({ ...user, password: "" });
  };

  // Guardar actualizaciones
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
  
    if (
      editForm.name.trimStart() !== editForm.name ||
      editForm.surname.trimStart() !== editForm.surname ||
      editForm.email.trimStart() !== editForm.email ||
      editForm.birthDate.trimStart() !== editForm.birthDate ||
      editForm.nickname.trimStart() !== editForm.nickname
    ) {
      setError("No puede haber espacios en blanco al inicio de los campos.");
      return;
    }
  
    if (!emailRule.test(editForm.email)) {
      setError("El correo electrónico no es válido.");
      return;
    }
  
    const response = await axios.get("http://localhost:8080/api/manage-users");
    const currentAdmins = response.data.content.filter(user => user.rol === "ADMIN");
  
    if (currentAdmins.length === 1 && editForm.rol === "USER" && currentAdmins[0].id === editForm.id) {
      setError("Debe haber al menos un administrador en el sistema.");
      return;
    }
  
    try {
      const res = await axios.put(`http://localhost:8080/api/manage-users/${editForm.id}`, editForm);
    
      if (res.data.status === "error") {
        setError(res.data.message);
        return;
      }
    
      setEditForm(null);
      fetchUsers();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error del servidor al actualizar el usuario.");
      }
    }
    
  };
  

  // Eliminar usuario
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/manage-users/${id}`);
    setPage(0); // Reiniciar paginación
    await fetchUsers(); 
  };

  // Paginado
  const nextPage = () => { 
    if (page < totalPages - 1) setPage(page + 1); 
  };
  const prevPage = () => { 
    if (page > 0) setPage(page - 1); 
  };

  console.log("Usuarios:", users);

  return (
   <div className="app">
      <Header />
      <div className="user-container">
      {editForm ? (
        <div className="user-edit-form">
          <form onSubmit={handleUpdate} className="user-create-form">
            <div className="edit-container">
            {error && <div className="error-message">{error}</div>}

              <h3 className="titles">Editar Usuario</h3>
            </div>
            <div className="input-group">
              <input type="text" placeholder="Alias" value={editForm.nickname} className="input-create" onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })} required />
              <input type="text" placeholder="Nombre" value={editForm.name} className="input-create" onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              <input type="text" placeholder="Apellido" value={editForm.surname} className="input-create" onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })} required />
              <input type="email" placeholder="Correo" value={editForm.email} className="input-create" onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
            </div>
            <div className="input-group">
              <input type="date" value={editForm.birthDate} className="input-create" onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })} required />
              <input type="password" placeholder="Nueva Contraseña" value={editForm.password} className="input-create" onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
              <select value={editForm.rol} className="input-create" onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })} 
                disabled={adminCount === 1 && editForm.rol === "ADMIN"}>
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <button type="submit" className="login-button">Actualizar Usuario</button>
            <button type="button" onClick={() => setEditForm(null)} className="cancel-button">Cancelar</button>
          </form>
        </div>
      ) : (
        <>
            <h2 className="titles">Gestión de Usuarios</h2>
        
          {error && <div className="error-message">{error}</div>}

          <form className="user-create-form" onSubmit={handleCreate}>
            <div className="edit-container">
              <h3 className="titles">Crear un nuevo Usuario</h3>
            </div>
            <input type="text" placeholder="Alias" className="input-create" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} required />

            <input type="text" placeholder="Nombre" className="input-create" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="text" placeholder="Apellido" className="input-create" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} required />
            <input type="email" placeholder="Correo" className="input-create" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input type="date" className="input-create" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required />
            <input type="password" placeholder="Contraseña" value={form.password} className="input-create" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select value={form.rol} className="input-create" onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <div className="checkbox-container">
              <label  style={{ color: "white" }}>
                <input
                  type="checkbox"
                  checked={form.acceptPrivacity}
                  onChange={(e) => setForm({ ...form, acceptPrivacity: e.target.checked })}
                  required
                  
                />
                Acepto la <Link to="/privacity">Política de privacidad</Link>
              </label>
            </div>

            <button type="submit" className="login-button">Crear Usuario</button>
          </form>
          <div className="table-user-management-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Alias</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Fecha de Nacimiento</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nickname}</td>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.email}</td>
                  <td>{user.birthDate}</td>
                  <td>{user.rol}</td>
                  <td>
                    <button onClick={() => handleEdit(user)} className="edit-button">Editar</button>
                    <button onClick={() => handleDelete(user.id)} className="nav-button" disabled={user.id === userId} style={{ cursor: user.id === userId ? 'not-allowed' : 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
          <div className="pagination">
            <button onClick={prevPage} disabled={page === 0}>Anterior</button>
            <span>Página {page + 1} de {totalPages}</span>
            <button onClick={nextPage} disabled={page >= totalPages - 1}>Siguiente</button>
          </div>
        </>
      )}
</div>
      <Footer />
    </div>
  );
};

export default UserManagement;
