import React, { useState } from "react";

function Lista() {
	const [tareas, setTareas] = useState([]);
	const [tareaInput, setTareaInput] = useState('');
	const [hoverIndex, setHoverIndex] = useState(null);

	const actualizarTarea = (push) => {
		setTareaInput(push.target.value);
	};

	const añadirTarea = () => {
		if (tareaInput.trim()) {
			setTareas([...tareas, tareaInput]);
			setTareaInput('');
		}
	};

	const manejarKeyDown = (push) => {
		if (push.key === 'Enter') {
			añadirTarea();
		}
	};

	const eliminarTarea = (index) => {
		const nuevaTarea = tareas.filter((_, i) => i !== index);
		setTareas(nuevaTarea);
	};

	return (
		<div className="body"> 
			<h1 style={{fontSize:'330%'}}>Lista de Tareas</h1>
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
					{tareas.map((tarea, index) => (
						<li
							key={index}
							onMouseEnter={() => setHoverIndex(index)}
							onMouseLeave={() => setHoverIndex(null)}
						>
							{tarea}
							{hoverIndex === index && (
								<button className="borrar" onClick={() => eliminarTarea(index)}> ❌ ​</button>
							)}
							<hr style={{ margin: '5px 0' }} />
						</li>
					))}
				</ul>
				<div className="tareasRestantes">
					Tareas restantes: {tareas.length}
				</div>
			</div>
		</div>
	);
}

export default Lista;

