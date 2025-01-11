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
import { useNavigate } from 'react-router-dom'


function Projeto() {

    const {id} = useParams()
    const [isAdm, setIsAdm] = useState(false)
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [tasks, setTasks] = useState([])
    const [members, setMembers] = useState([])
    const [taskMembers, setTaskMembers] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [msg, setMsg] = useState('')
    const [type, setType] = useState('')

    const navigate = useNavigate()

    function createService(newService) {
        setMsg(''); // Limpa a mensagem anterior
    
     
        if (!project.services || project.services.length === 0) {
            project.services = [];
        }
    
        // Cria um novo serviço com um ID único
        const lastService = {
            ...newService,
            id: uuidv4(),  // Gera um ID único para o serviço
        };
    
        // Cria um FormData para enviar os dados
        const formData = new FormData();
    
        // Adiciona os dados do serviço ao FormData
        for (const key in lastService) {
            if (lastService[key]) {
                formData.append(key, lastService[key]);
            }
        }
    
        // Se houver arquivos para enviar, adiciona ao FormData
        if (newService.files && newService.files.length > 0) {
            newService.files.forEach((file) => {
                formData.append('files', file);
            });
        }
        
    
        // Verifica se o custo do novo serviço está dentro do orçamento do projeto
        const serviceCost = parseFloat(lastService.cost);
        const newCost = parseFloat(project.cost) + serviceCost;
        
        if (newCost > parseFloat(project.budget)) {
            setMsg('Orçamento ultrapassado, verifique o valor do serviço');
            setType('error');
            return;
        }
    
        // Atualiza o projeto com o novo custo
        const updatedProject = {
            ...project,
            cost: newCost, // Atualiza o custo total do projeto
            services: [...project.services, lastService], // Adiciona o novo serviço à lista de serviços
        };
    
        // Faz a requisição POST para adicionar o serviço
        fetch(`http://localhost:5000/projects/${project.id}/services`, {
            method: 'POST', // Usando POST para criar um novo serviço
            body: formData, // Envia os dados como FormData, incluindo arquivos
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log('Serviço criado com sucesso!', data.services);
            setProject(data); // Atualiza o estado com os dados do projeto atualizados
            setServices(data.services); // Atualiza a lista de serviços
            setMsg('Serviço criado com sucesso!');
            setType('success');
        })
        .catch((erro) => {
            console.error('Erro ao adicionar serviço:', erro);
            setMsg('Erro ao adicionar serviço!');
            setType('error');
        });
    }

    function createTask(formData) {
        setMsg(''); // Limpa a mensagem anterior
    
        // Verifica se o projeto já tem tarefas, se não, inicializa um array
        if (!project.tasks || project.tasks.length === 0) {
            project.tasks = [];
        }
    
        // Atualiza o projeto com a nova tarefa
        const updatedProject = {
            ...project,
            tasks: [...project.tasks, formData.get('task')], // Adiciona a tarefa ao projeto
        };

        console.log('Projeto atualizado:', updatedProject)
    
        // Envia o FormData com os dados da tarefa para o backend
        fetch(`http://localhost:5000/projects/${project.id}/tasks`, {
            method: 'POST',
            body: formData, // Envia o FormData diretamente
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log('Tarefa criada com sucesso!', data);
            setProject(data); // Atualiza o estado do projeto com os dados retornados
            setTasks(data); // Atualiza a lista de tarefas
            setMsg('Tarefa criada com sucesso!');
            setType('success');
        })
        .catch((erro) => {
            console.error('Erro ao adicionar tarefa:', erro);
            setMsg('Erro ao adicionar tarefa!');
            setType('error');
        });
    }
    
    function fetchMembers(ids) {
        Promise.all(ids.map(id => 
            fetch(`http://localhost:5000/members/${id}`)
            .then(response => response.json())
        ))
        .then(membersData => {
            setTaskMembers(membersData); 
        
        })
        .catch(error => {
            console.error('Erro ao carregar membros:', error);
            setMsg('Erro ao carregar membros do projeto!');
            setType('error');
        });
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
                credentials: 'include'
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
                     // Chama fetchMembers para obter os dados dos membros das tarefas
                 data.tasks.forEach(task => {
                   fetchMembers(task.members);  // Passa os IDs dos membros da tarefa
            });
                    setIsAdm(data.isAdm)
                })
                .catch((erro) => {
                    console.error(erro.message);
                    setProject(null); // Define como nulo em caso de erro
                });
        }, 1000);
    }, [id]);

    useEffect(() => {
    }, [taskMembers]);  // O efeito será acionado sempre que taskMembers for atualizado
    
    

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

    const restante = parseFloat(project.budget) - parseFloat(project.cost)
    
        
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

    function foramatarData(data) {
        const novaData = data.replace(/-/g, '/');
        return novaData
    }

   
    return (
        <>{project.name ? (
        <div className={styles.project_details}>
            
                {msg && <Mensagem type={type} msg={msg} />}

                <div className={styles.details_container}>

                    <h1>Projeto:{project.name}</h1>
                    {isAdm  && (
                          <button className={styles.btn} onClick={toggleProjectForm}>{!showProjectForm ? 'Editar Projeto' : 'Fechar'}</button>
                    )}
                   
                     
                     {!showProjectForm? (
                       <div className={styles.project_info}>

                            <p>
                                <span>Prazo: </span>{foramatarData(project.end_date)}</p>
                           <p>
                            <span>Categoria: </span>{project.category.name}
                           </p> 

                           <p>
                            <span>Total de Orçamento: </span> R$ {project.budget}
                           </p>

                           <p>
                            <span>Total Utilizado: </span> R$ {project.cost}
                            </p>

                            <p>
                            <span>Valor Restante: </span> R$ {restante}
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
        <div className={styles.tasks_container}>
         {tasks.length > 0 && (
            tasks.map((task) => {

                const responsaveis = task.members.map((memberId) => {
                    const member = taskMembers.find((m) => m.id === memberId);
                    return member ? member.name : null;  // Retorna null se não encontrado
                }).filter((name) => name !== null);  // Filtra valores null
           
            return (
                <Tasks 
                    id={task.id}
                    name={task.name}
                    cost={task.cost}
                    descricao={task.descricao}
                    prioridade={task.prioridade}
                    prazo={foramatarData(task.prazo)}
                    status={task.status}
                    files={task.files}
                    responsaveis={responsaveis.join(', ')}  // Concatena os nomes dos responsáveis
                    key={task.id}
                    handleRemove={removeTask}
                />
            );
        })
    )}
    {tasks.length === 0 && <p>Não há tarefas cadastradas</p>}
</div>

                <div className={styles.services_form_container}>
                   {
                    isAdm && (
                        <button onClick={() => setShowTaskForm(!showTaskForm)} className={styles.btn}>{!showTaskForm ? 'Adicionar Tarefa' : 'Fechar'}</button>
                    )
                   }

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
                <div className={styles.services_container}>
                    {services.length > 0 && (
                        services.map((service) => (
                            <ServiceCard 
                            id={service.id}
                            name={service.name}
                            cost={service.cost}
                            description={service.description}
                            key={service.id}
                            handleRemove={removeService}
                            isAdm={isAdm}
                            />

                        ))
                    )}
                    {services.length === 0 && <p>Não há serviços cadastrados</p>}
               </div>
                
                <div className={styles.services_form_container}>
                   {
                    isAdm && (
                        <button onClick={toggleServiceForm} className={styles.btn}>{!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}</button>
                    )
                   }
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