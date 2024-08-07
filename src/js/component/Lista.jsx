import React, {useState} from "react";

function Lista() {
	const [tareas, setTareas] = useState([]);
	const [tareaInput, setTareaInput] = useState('');
  
	const actualizarTarea = (push) => {
	  setTareaInput(push.target.value);
	};
  
	const añadirTarea = () => {
	  if (tareaInput.trim()) {
		setTareas([...tareas, tareaInput]);
		setTareaInput('');
	  }
	};
  
	const eliminarTarea = (index) => {
	  const nuevaTarea = tareas.filter((_, i) => i !== index);
	  setTareas(nuevaTarea);
	};
  
	return (
	  <div className="App">
		<h1>Lista de Tareas</h1>
		<input 
		  type="text" 
		  value={tareaInput} 
		  onChange={actualizarTarea} 
		  placeholder="Añadir nueva tarea" 
		/>
		<button onClick={añadirTarea}>Añadir</button>
		<ul>
		  {tareas.map((tarea, index) => (
			<li key={index}>
			  {tarea}
			  <button onClick={() => eliminarTarea(index)}>Eliminar</button>
			</li>
		  ))}
		</ul>
	  </div>
	);
  }
  
  export default Lista;