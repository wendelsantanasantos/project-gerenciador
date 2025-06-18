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
import { ImBin } from "react-icons/im";
import { Navigate } from 'react-router-dom';



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
        setMsg('');
    
        // Validação básica dos campos obrigatórios
        if (!newService.name || !newService.cost) {
            setMsg('Preencha todos os campos obrigatórios!');
            setType('error');
            return;
        }
    
        // Inicializa serviços, se necessário
        const projectServices = project.services || [];
    
        // Criação do novo serviço
        const lastService = {
            ...newService,
            id: uuidv4(),
        };
    
        // Prepara o FormData para envio
        const formData = new FormData();
        for (const key in lastService) {
            if (lastService[key]) {
                formData.append(key, lastService[key]);
            }
        }
        if (newService.files && newService.files.length > 0) {
            newService.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        const serviceCost = parseFloat(lastService.cost);
        const newCost = parseFloat(project.cost) + serviceCost;
    
        if (newCost > parseFloat(project.budget)) {
            setMsg('Orçamento ultrapassado, verifique o valor do serviço');
            setType('error');
            return;
        }
        const updatedProject = {
            ...project,
            cost: newCost,
            services: [...projectServices, lastService],
        };
        fetch(`http://localhost:5000/projects/${project.id}/services`, {
            method: 'POST',
            body: formData,
        })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error('Erro na comunicação com o servidor');
                }
                return resp.json();
            })
            .then((data) => {
                console.log('Serviço criado com sucesso!', data.services);
                setProject(data);
                setServices(data.services); 
                setMsg('Serviço criado com sucesso!');
                setType('success');
            })
            .catch((error) => {
                console.error('Erro ao adicionar serviço:', error);
                setMsg('Erro ao adicionar serviço!');
                setType('error');
            });
    }
    

    function removeProject(id) {
        fetch(`http://localhost:5000/projects/${id}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then(() => {
            console.log('Projeto removido com sucesso!');
            navigate('/MeusProjetos', {state: {msg: 'Projeto removido com sucesso!'}})
        })
        .catch((erro) => {
            console.error('Erro ao remover projeto:', erro);
            setMsg('Erro ao remover projeto!');
            setType('error');
            
        });
    }

    function createTask(formData) {
        setMsg(''); 

        console.log("Dados do FormData na  tarefaPage:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        if (!project.tasks || project.tasks.length === 0) {
            project.tasks = [];
        }
            const updatedProject = {
            ...project,
            tasks: [...project.tasks, formData.get('task')], 
        };

        console.log('Projeto atualizado:', updatedProject)
    
        fetch(`http://localhost:5000/projects/${project.id}/tasks`, {
            method: 'POST',
            body: formData,
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log('Tarefa criada com sucesso!', data);
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
    }, [taskMembers]); 
    
    

    function editProject(project) {
        setMsg('');
      
        // Validação do orçamento
        if (project.budget < project.cost) {
          setMsg('O orçamento não pode ser menor que o custo do projeto!');
          setType('error');
          return;
        }
      
        // Chamada para a API
        fetch(`http://localhost:5000/projects/${project.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project),
          credentials: 'include',
        })
          .then((resp) => {
            // Verifica se a resposta foi bem-sucedida
            if (!resp.ok) {
              throw new Error(`Erro na API: ${resp.status} - ${resp.statusText}`);
            }
            return resp.json();
          })
          .then((data) => {
            setProject(data);
            setMsg('Projeto atualizado com sucesso!');
            setType('success');
            setShowProjectForm(false)
   
          })
          .catch((erro) => {
            console.error(erro);
            setMsg('Erro ao atualizar o projeto. Tente novamente mais tarde.');
            setType('error');
          });
      }
      
   
    const restante = parseFloat(project.budget) - parseFloat(project.cost)
    

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
        if (!data) return '';
        const novaData = data.replace(/-/g, '/');
        return novaData
    }

    function formatStatus(status) {
        const statusMap = {
          planejando: "Planejando",
          "aguardando-aprovacao": "Aguardando aprovação",
          pendente: "Pendente",
          "em-andamento": "Em andamento",
          "em-revisao": "Em revisão",
          concluido: "Concluído",
        };
      
        return statusMap[status?.toLowerCase()] || "Pendente";
      }
      

   
    return (
        <>{project.name ? (
        <div className={styles.project_details}>
            
                {msg && <Mensagem type={type} msg={msg} />}

                <div className={styles.details_container}>

                    <h1>Projeto:{project.name}</h1>
                    {isAdm  && (
                          <div><button className={styles.btn} onClick={toggleProjectForm}>{!showProjectForm ? 'Editar Projeto' : 'Fechar'}</button>

                            <button className={styles.btn } onClick={removeProject}><ImBin />{'Excluir Projeto'}</button>
                          
                          </div>

                          
                    )}
                   
                     
                     {!showProjectForm? (
                       <div className={styles.project_info}>

                            <p>
                                <span>Prazo: </span>{foramatarData(project.end_date)}</p>
                           <p>
                            <span>Categoria: </span>{project.category.name}
                           </p> 

                           <p>
                            <span>Status: </span> {formatStatus(project.status)}
                           </p>
                            <p>
                            <span>Descrição: </span> {project.description}
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