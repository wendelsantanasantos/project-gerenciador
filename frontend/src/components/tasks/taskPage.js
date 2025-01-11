import styles from './taskPage.module.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../Layout/Loading";
import TaskForm from './tasksForm';

function TaskPage() {
    const { id } = useParams();
    const [task, settask] = useState(null);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState('');
    const [showtaskForm, setShowtaskForm] = useState(false); // Para controlar a exibição do formulário
    const [isAdm, setIsAdm] = useState(false); // Estado inicial como 'false'

    useEffect(() => {
        // Verifica se o usuário é administrador assim que o componente é montado
        const isAdmin = localStorage.getItem('isAdm') === 'true';
        setIsAdm(isAdmin); // Atualiza o estado de isAdm

        // Faz a requisição para buscar o tarefa
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`Erro ao buscar o tarefa: ${resp.status}`);
            }
            return resp.json();
        })
        .then((data) => {
            settask(data);
        })
        .catch((error) => {
            console.error(error.message);
            setMsg('Erro ao carregar os dados do tarefa!');
            setType('error');
        });
    }, [id]);

    function edittask(task){

    setMsg('')
    console.log('task',task)

      fetch(`http://localhost:5000/projects/tasks/${id}/edit`, {
        method:'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task),
        credentials: 'include'
      })
      .then((resp) => resp.json())
      .then((data) => {
        settask(data)
        setShowtaskForm(false)
        setMsg('tarefa atualizado!')
        console.log(data)
        setType('success')
      })
      .catch(
        (erro) => console.log(erro))
      
    }

    const toggletaskForm = () => {
        setShowtaskForm(prevState => !prevState);
    };

  
    function foramatarData(data) {
        const novaData = data.replace(/-/g, '/');
        return novaData
    }


    return (
        <>
            {msg && <p className={`${styles.message} ${styles[type]}`}>{msg}</p>}
            {task ? (
                <div className={styles.task_details}>
                    <h1>{task.name}</h1>
                    <p><strong>Prioridade:</strong> {task.prioridade}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                    <p><strong>Responsáveis:</strong> {task.members}</p>
                    <p><strong>Descrição:</strong> {task.descricao}</p>
                    <p><strong>Prazo de conclusão:</strong> {foramatarData(task.prazo)}</p>

                    <div className={styles.tasks_form_container}>
                        {isAdm && (
                            <button onClick={toggletaskForm} className={styles.btn}>
                                {!showtaskForm ? 'Editar tarefa' : 'Fechar'}
                            </button>
                        )}
                        {showtaskForm && (
                            <div className={styles.project_info}>
                                <TaskForm
                                    handleSubmit={edittask}
                                    btnText="Editar tarefa"
                                    projectData={task}
                                />
                            </div>
                        )}
                    </div>

                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default TaskPage;
