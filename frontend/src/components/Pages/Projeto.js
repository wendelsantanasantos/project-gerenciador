import styles from './Projeto.module.css'
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from "react";
import Loading from "../Layout/Loading";
import ProjectForm from '../project/projectForm';
import ServiceForm from "../services/ServiceForm";
import ServiceCard from "../services/serviceCard";
import TasksForm from '../tasks/tasksForm';
import Tasks from '../tasks/tasks';
import Mensagem from "../Layout/Mensagem";
import { VscAccount } from "react-icons/vsc";

function Projeto() {

    const {id} = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [tasks, setTasks] = useState([])
    const [members, setMembers] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')

    function createService(){

        setMsg('')

        const lastTask = project.services[project.services.length - 1]
        lastTask.id = uuidv4()

        const lastServiceCost = lastTask.cost

        const newCost = parseFloat(project.cost)+parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){
            setMsg('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}/services`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
            setMsg('Serviço adicionado!')
            setType('success')
        })
        .catch(
            (erro) => console.log(erro))
        
    }

    const toggleProjectForm = () => setShowProjectForm(!showProjectForm)
    const toggleServiceForm = () => setShowServiceForm(!showServiceForm)
    

    useEffect(() => {
        setTimeout(() => {

            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error(`Erro ao buscar o projeto: ${resp.status}`);
                    }
                    return resp.json();
                })
                .then((data) => {
                    setProject(data);
                    setServices(data.services || []); 
                    setTasks(data.tasks || [])
                    teamMembers(data.id)
                })
                .catch((erro) => {
                    console.error(erro.message);
                    setProject(null); // Define como nulo em caso de erro
                });
        }, 1000);
    }, [id]);
    

    function editProject(project){

        setMsg('')

      if(project.budget < project.cost){
        setMsg('O orçamento não pode ser menor que o custo do projeto!')
        setType('error')
        return
      }
      fetch(`http://localhost:5000/projects/${project.id}`, {
        method:'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project),
        credentials: 'include'
      })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setShowProjectForm(false)
        setMsg('Projeto atualizado!')
        setType('success')
      })
      .catch(
        (erro) => console.log(erro))
      
    }

    function removeService(id, cost) {
        setMsg('');
    
        const parsedCost = parseFloat(cost) || 0; // Garantir que cost seja numérico
    
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        );
    
        const projectUpdated = { ...project }; // Crie uma cópia do projeto
        projectUpdated.services = servicesUpdated;
        projectUpdated.cost = parseFloat(projectUpdated.cost || 0) - parsedCost;
    
        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(projectUpdated);
                setServices(servicesUpdated);
                setMsg('Serviço removido!');
                setType('success');
            })
            .catch((erro) => {
                console.log(erro);
                setMsg('Erro ao remover serviço!');
                setType('error');
            });
    }

    function createTask() {
        setMsg(''); // Limpa a mensagem anterior
    
        console.log(project);
    
        if (!project.tasks || project.tasks.length === 0) {
            project.tasks = [];
        }
    
        const lastTask = project.tasks[project.tasks.length - 1] || {};
        lastTask.id = uuidv4();
    
        // Cria um objeto FormData para enviar dados e arquivos
        const formData = new FormData();
    
        // Adiciona os campos de texto da tarefa ao FormData
        for (const key in lastTask) {
            formData.append(key, lastTask[key]);
        }
    
        // Adiciona os arquivos (se houver) ao FormData
        if (lastTask.file && lastTask.file.length > 0) {
            lastTask.file.forEach((file) => {
                formData.append('file', file);
            });
        }
    
        // Envia a requisição ao backend para atualizar o projeto
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            body: formData,  // Envia o FormData que contém tanto os dados da tarefa quanto os arquivos
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log('Tarefa criada com sucesso!', data.tasks);
            setProject(data); // Atualiza o projeto
            setTasks(data.tasks); // Atualiza as tarefas
            setMsg('Tarefa adicionada!');
            setType('success');
        })
        .catch((erro) => {
            console.error('Erro ao criar a tarefa:', erro);
            setMsg('Erro ao adicionar tarefa!');
            setType('error');
        });
    }
    
        
        function removeTask(id) {
            setMsg('');
        
            fetch(`http://localhost:5000/projects/${project.id}/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error('Erro na remoção da tarefa');
                }
                return resp.json();
            })
            .then((data) => {
                setProject(data);
                setTasks(data.tasks);
                setMsg('Tarefa removida!');
                setType('success');
            })
            .catch((error) => {
                console.error(error);
                setMsg('Erro ao remover tarefa!');
                setType('error');
            });
        }

        function teamMembers(id) {
            setMsg('');
        
            fetch(`http://localhost:5000/projects/${id}/members`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((resp) => resp.json())
            .then((data) => {
                setMembers(data);
            })
            .catch((error) => {
                console.error(error);
                setMsg('Erro ao carregar membros do projeto!');
                setType('error');
            });
        }
        
    

    return (
        <>{project.name ? (
        <div className={styles.project_details}>
            
                {msg && <Mensagem type={type} msg={msg} />}

                <div className={styles.details_container}>

                    <h1>Projeto:{project.name}</h1>
                     <button className={styles.btn} onClick={toggleProjectForm}>{!showProjectForm ? 'Editar Projeto' : 'Fechar'}</button>
                     
                     {!showProjectForm? (
                       <div className={styles.project_info}>
                           <p>
                            <span>Categoria: </span>{project.category.name}
                           </p> 

                           <p>
                            <span>Total de Orçamento: </span> R$ {project.budget}
                           </p>

                           <p>
                            <span>Total Utilizado: </span> R$ {project.cost}
                            </p>

                       </div>
                     ):  (
                        <div className={styles.project_info}>
                            <ProjectForm handleSubmit={editProject} btnText="Concluir edição" projectData={project} />
                        </div>
                     ) }
                </div>

                <h2>
                    Tarefas
                </h2>
        
                    {tasks.length > 0 && (
                        tasks.map((task) => (
                            <Tasks 
                            id={task.id}
                            name={task.name}
                            cost={task.cost}
                            descricao={task.descricao}
                            prioridade={task.prioridade}
                            prazo={task.prazo}
                            status={task.status}
                            files={task.files}
                            responsaveis={task.responsaveis}
                            key={task.id}
                            handleRemove={removeTask}
                            />
                        ))
                    )}
                    {tasks.length === 0 && <p>Não há tarefas cadastradas</p>}


                <div className={styles.services_form_container}>
                    <button onClick={() => setShowTaskForm(!showTaskForm)} className={styles.btn}>{!showTaskForm ? 'Adicionar Tarefa' : 'Fechar'}</button>

                    <div className={styles.project_info}>
                    {showTaskForm && (
                        <TasksForm 
                        handleSubmit={createTask}
                        btnText="Adicionar Tarefa" 
                        projectData={project}
                        />
                    )}
                    </div>

                </div>

                <h2>
                    Serviços
                </h2>
                    {services.length > 0 && (
                        services.map((service) => (
                            <ServiceCard 
                            id={service.id}
                            name={service.name}
                            cost={service.cost}
                            description={service.description}
                            key={service.id}
                            handleRemove={removeService}
                            />
                        ))
                    )}
                    {services.length === 0 && <p>Não há serviços cadastrados</p>}
                
                <div className={styles.services_form_container}>
                    <button onClick={toggleServiceForm} className={styles.btn}>{!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}</button>

                    <div className={styles.project_info}>
                    {showServiceForm && (
                        <ServiceForm 
                        handleSubmit={createService}
                        btnText="Adicionar Serviço" 
                        projectData={project}/>
                    )}
                    </div>
                </div>
      
        
                <h2>
                    Equipe
                </h2>

                <div className={styles.members_container}>
                    {members.length > 0 && (
                        members.map((member) => (
                            <div className={styles.member} key={member.id}>
                                
                                
                                <span className={styles.hide}>{member.id}</span>

                                <div className={styles.memberHeader}>
                                    <div className={styles.avatar_imgContainer}>
                                    {member.img ? <img src={`http://localhost:5000${member.img}`} alt={member.name} /> : <VscAccount /> }
                                    </div>
                                    <h3>{member.name}</h3>
                                </div>
                                <p>{member.email}</p>
                            </div>
                        ))
                    )}
                    {project.members.length === 0 && <p>Não há membros cadastrados</p>}
                </div>
            
        </div>
    ) : (<Loading />)}</>
       
    )
}

export default Projeto