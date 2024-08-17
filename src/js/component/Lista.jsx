import React, { useState, useEffect } from "react";

function Lista() {
    const [tareas, setTareas] = useState([]);
    const [tareaInput, setTareaInput] = useState('');
    const [hoverIndex, setHoverIndex] = useState(null);

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('registroForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const usernameInput = document.getElementById('username');
            const username = usernameInput.value.trim();
            const apiUrl = "https://playground.4geeks.com/todo/users/"
    
            if (username) {
                const resultado = await comprobarYCrearUsuario(username);
                mostrarMensaje(resultado);
                usernameInput.value = '';
            }
        });
    
        const comprobarYCrearUsuario = async (username) => {
            try {
                const response = await fetch(`${apiUrl} ${username}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
    
                if (!response.ok) {
                    throw new Error('Error al verificar el usuario');
                }
    
                const usuarios = await response.json();
    
                if (usuarios.length > 0) {
                    return `El usuario "${username}" ya existe.`;
                } else {
                    const nuevoUsuarioResponse = await fetch('https://playground.4geeks.com/todo/users/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username }),
                    });
    
                    console.log('Respuesta del servidor:', nuevoUsuarioResponse);
    
                    if (!nuevoUsuarioResponse.ok) {
                        const errorData = await nuevoUsuarioResponse.json();
                        throw new Error(`Error al crear el nuevo usuario: ${errorData.message || 'Desconocido'}`);
                    }
    
                    const nuevoUsuario = await nuevoUsuarioResponse.json();
                    return `Nuevo usuario creado: ${nuevoUsuario.username}`;
                }
            } catch (error) {
                console.error('Error en la operación:', error);
                return `Ocurrió un error al procesar la solicitud: ${error.message}`;
            }
        };
    
        const mostrarMensaje = (mensaje) => {
            const mensajeDiv = document.getElementById('mensaje');
            mensajeDiv.textContent = mensaje;
        };
    });

    useEffect(() => {
        fetchTareas();
    }, []);

    const fetchTareas = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/carlosMolina");
            if (!response.ok) throw new Error('Error en la red');

            const data = await response.json();

            if (data.todos && Array.isArray(data.todos)) {
                setTareas(data.todos);
            } else {
                console.error('La respuesta no contiene un array de tareas:', data);
                setTareas([]);
            }
        } catch (error) {
            console.error('Error fetching tareas:', error);
            setTareas([]);
        }
    };

    const actualizarTarea = (event) => {
        setTareaInput(event.target.value);
    };

    const añadirTarea = async () => {
        if (tareaInput.trim()) {
            try {
                const response = await fetch("https://playground.4geeks.com/todo/todos/carlosMolina", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ label: tareaInput }),
                });
                if (!response.ok) throw new Error('Error al añadir tarea');
                const nuevaTarea = await response.json();
                setTareas([...tareas, nuevaTarea]);
                setTareaInput('');
            } catch (error) {
                console.error('Error al añadir tarea:', error);
            }
        }
    };

    const manejarKeyDown = (event) => {
        if (event.key === 'Enter') {
            añadirTarea();
        }
    };

    const eliminarTarea = async (index) => {
        try {
            const id = tareas[index].id;
            const response = await fetch(`${"https://playground.4geeks.com/todo/todos"}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar tarea');
            const nuevaTarea = tareas.filter((_, i) => i !== index);
            setTareas(nuevaTarea);
        } catch (error) {
            console.error('Error deleting tarea:', error);
        }
    };

    return (
        <div className="body">
            <form id="registroForm">
                <label htmlFor="username">Usuario:</label>
                <input type="text" id="username" required />
                <button type="submit">Ingresar</button>
            </form>
            <h1 style={{ fontSize: '330%' }}>Lista de Tareas</h1>
            <div className="lista">
                <input
                    className="inputTarea"
                    type="text"
                    value={tareaInput}
                    onChange={actualizarTarea}
                    onKeyDown={manejarKeyDown}
                    placeholder="Añadir nueva tarea"
                />
                <button className="añadir" onClick={añadirTarea}> ✔️​</button>
                <ul>
                    {Array.isArray(tareas) && tareas.map((tarea, index) => (
                        <li key={tarea.id} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(null)}>
                            <span>{tarea.label}</span>
                            {hoverIndex === index && (
                                <button className="borrar" onClick={() => eliminarTarea(index)}> ❌ ​</button>
                            )}
                            <hr style={{ margin: '5px 0' }} />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tareasRestantes">
                Tareas restantes: {tareas.length}
            </div>
            <script src="../src/js/index.js"></script>
        </div>
    );
}


export default Lista;