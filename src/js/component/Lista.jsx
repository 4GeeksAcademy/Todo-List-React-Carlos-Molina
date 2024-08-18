import React, { useState, useEffect } from "react";

function Lista() {
    const [tareas, setTareas] = useState([]);
    const [tareaInput, setTareaInput] = useState('');
    const [hoverIndex, setHoverIndex] = useState(null);

    const crearUsuario = () => {
        fetch("https://playground.4geeks.com/todo/users/carlosMolina", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then (response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

    useEffect(() => {
        crearUsuario(), fetchTareas();
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
        </div>
    );
}


export default Lista;