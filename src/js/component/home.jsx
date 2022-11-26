import { func } from "prop-types";
import React, {useState, useEffect} from "react";

//create your first component

const Home = () => {
	const [tasks, setTasks] = useState([])
	const [newTask, setNewTask]=useState("")
	const apiUrl = "https://assets.breatheco.de/apis/fake/todos/user/afantiniv"

	function addTask(e){
		if(e.code=="Enter" && newTask!=""){
			setTasks([...tasks, {label: newTask, done: false}])
			setNewTask("")
		}
	}

	const [deleteTask, setDeleteTask] = useState("")
		
	async function removeTask(index){
		console.log(index)
		var newTasks = [...tasks]
		newTasks.splice(index, 1)
		setTasks(newTasks)
	}

	function checkTask(index) {
		//Actualiza check
		var newTasks = [...tasks]
		newTasks[index] = {...newTasks[index], done:!newTasks[index].done}
		setTasks(newTasks)
	}

	async function clearList(){
		var clearlist = []
		setTasks(clearlist)
		let respdelete = await  fetch(apiUrl,{
			method:"DELETE",
			headers:{
				"Content-Type":"application/json"
			}
		})
		var respuesta = await fetch(apiUrl,{
				method:"POST",
				body:JSON.stringify([]),
				headers:{
					"Content-Type":"application/json"
				}
			})
			// Traer la nueva lista
			respuesta = await fetch(apiUrl)
	
			console.log("Lista Eliminada")

	}

	useEffect(async ()=>{ // ComponentDidUpdate -> tasks
		if(tasks.length>0){
			let resp = await fetch(apiUrl,{
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
		var respuesta =await fetch(apiUrl)
		// Verificar si la lista no existe, en cuyo caso hay que crearla
		if (respuesta.status==404){
			// Crear la lista
			respuesta =await fetch(apiUrl,{
				method:"POST",
				body:JSON.stringify([]),
				headers:{
					"Content-Type":"application/json"
				}
			})
			// Traer la nueva lista
			respuesta =await fetch(apiUrl)
		}else if(!respuesta.ok){
			// Error
			console.error("Error al cargar la lista: " + respuesta.statusText)
		}
		//Cargar la data del body
		var data=await respuesta.json()
		// Actualiza el estado con la data
		setTasks(data)
	},[])


/*<li className="list-group-item d-flex justify-content-between align-items-center">
    				<input className="form-control" type="text" onKeyDown={e=>addTask(e)} onChange={e=>setNewTask(e.target.value)} value={newTask}  name="task" id="task" />
					<button>Clear List</button>
  				</li>*/

	return (
		<div className="container d-flex flex-column mt-5 justify-content-center">
			<h1>ToDos list</h1>
			<div className=" input-group mb-3">
				<input className="form-control" type="text" onKeyDown={e=>addTask(e)} onChange={e=>setNewTask(e.target.value)} value={newTask}  name="task" id="task" />
				<button className="input-group-text" onClick={()=>clearList()}>Clear List</button>
			</div>
			<div className="row">
				<ul className="list-group">
						{tasks.map((task, index)=>(
							<li key={index} className="list-group-item todoitem d-flex justify-content-between align-items-center">
								<div>
									<input className="form-check-input me-2" type="checkbox" value={task.done} id="flexCheckDefault" onChange={()=>checkTask(index)}/>
									{task.label}
								</div>
								<button className="badge hover-hidden bg-danger rounded-pill" onClick={()=>removeTask(index)}>X</button>
							</li>
						))}
						<li className="list-group-item d-flex disabled text-muted justify-content-center align-items-center">
							<small>{tasks.length} items.</small> 
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Home;
