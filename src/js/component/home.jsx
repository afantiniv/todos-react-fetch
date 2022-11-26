import React, {useState, useEffect} from "react";

//create your first component

const Home = () => {
	const [tasks, setTasks] = useState([])
	const [newTask, setNewTask]=useState("")

	function addTask(e){
		if(e.code=="Enter" && newTask!=""){
			setTasks([...tasks, {label: newTask, done: false}])
			setNewTask("")
		}
	}

	const [deleteTask, setDeleteTask] = useState("")
		
	function removeTask(index){
		console.log(index)

		var newTasks = [...tasks]
		newTasks.splice(index, 1)
		setTasks(newTasks)
	}

	useEffect(async ()=>{ // ComponentDidUpdate -> tasks
		if(tasks.length>0){
			let resp = await fetch("https://assets.breatheco.de/apis/fake/todos/user/afantiniv",{
				method:"PUT",
				body:JSON.stringify(tasks),
				headers:{
					"Content-Type":"application/json"
				}
			})
			if(resp.ok){
				console.info("Lista actualizada")
			}
		}else{
			// Delete
		}
	},[tasks])

	useEffect(async() => { // ComponentDidMount
		// Intenta traer la lista
		var respuesta =await fetch("https://assets.breatheco.de/apis/fake/todos/user/afantiniv")
		// Verificar si la lista no existe, en cuyo caso hay que crearla
		if (respuesta.status==404){
			// Crear la lista
			respuesta =await fetch("https://assets.breatheco.de/apis/fake/todos/user/afantiniv",{
				method:"POST",
				body:JSON.stringify([]),
				headers:{
					"Content-Type":"application/json"
				}
			})
			// Traer la nueva lista
			respuesta =await fetch("https://assets.breatheco.de/apis/fake/todos/user/afantiniv")
		}else if(!respuesta.ok){
			// Error
			console.error("Error al cargar la lista: " + respuesta.statusText)
		}
		//Cargar la data del body
		var data=await respuesta.json()
		// Actualiza el estado con la data
		setTasks(data)
	},[])


	return (
		<div className="container-fluid d-flex mt-5 justify-content-center">
			<ul className="list-group w-50">
				<li className="list-group-item d-flex justify-content-between align-items-center">
    				<input className="form-control" type="text" onKeyDown={e=>addTask(e)} onChange={e=>setNewTask(e.target.value)} value={newTask}  name="task" id="task" />
  				</li>
  				{tasks.map((task, index)=>(
					<li key={index} className="list-group-item todoitem d-flex justify-content-between align-items-center">
    				{task.label}
    				<button className="badge hover-hidden bg-danger rounded-pill" onClick={()=>removeTask(index)}>X</button>
  					</li>
				))}
				<li className="list-group-item d-flex disabled text-muted justify-content-center align-items-center">
    				<small>{tasks.length} items.</small> 
  				</li>
			</ul>
		</div>
	);
};

export default Home;
