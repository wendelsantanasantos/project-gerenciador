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
    const [files, setFiles] = useState([]);
    const backendUrl = "http://localhost:5000"; // URL base do backend


    const [showFiles, setShowFiles] = useState(false); // Estado para controlar a visibilidade dos arquivos

    const toggleFilesVisibility = () => {
        setShowFiles(!showFiles);
    };

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
            console.log('Dados da tarefa', data);
            setFiles(data.files);
            console.log('Arquivos da tarefa', data.files);

        })
        .catch((error) => {
            console.error(error.message);
            setMsg('Erro ao carregar os dados do tarefa!');
            setType('error');
        });
    }, [id]);

        const isImage = (fileName) => {
            // Lista de extensões válidas para imagens
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
            
            // Verifica se a extensão do arquivo está na lista de imagens
            return imageExtensions.some(extension => fileName.toLowerCase().endsWith(extension));
        };
    
        function getFileName(filePath) {
            return filePath.replace(/^.*[\\\/]/, ''); // Extrai o nome do arquivo do caminho
        }
    

    function edittask(formData) {

    setMsg('')
     // Exibir dados do FormData no console
     console.log("Dados do FormData na  tarefaPage:");
     for (const [key, value] of formData.entries()) {
         console.log(`${key}:`, value);
     }

      fetch(`http://localhost:5000/projects/tasks/${id}/edit`, {
        method:'PATCH',
        body: formData,
        credentials: 'include'
      })
      .then((resp) => resp.json())
      .then((data) => {
        settask(data)
        setShowtaskForm(false)
        setMsg('tarefa atualizado!')
        console.log('Dados atualizados  da tarefa ',data)
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
                                    taskToEdit={task}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                <button onClick={toggleFilesVisibility}>
                    {showFiles ? 'Ocultar arquivos' : 'Mostrar arquivos'}
                </button>
                {showFiles && (
                    <div>
                        <p><strong>Arquivos Anexados:</strong></p>
                        <div className={styles.filesContainer}>
                            {files && files.length > 0 ? (
                                files.map((filePath, index) => {
                                    const fileName = getFileName(filePath); // Extrai o nome do arquivo

                                    return (
                                        <div key={index} className={styles.filesCard}>
                                        {isImage(fileName) ? (
                                            <img
                                                src={`${backendUrl}/uploads/${fileName}`} // Usando o nome do arquivo
                                                alt={`Imagem anexada ${index}`}
                                                className={styles.previewImage}
                                            />
                                        ) : fileName.toLowerCase().endsWith('.pdf') ? (
                                            <div>
                                                <p>{fileName}</p>
                                                <iframe
                                                    src={`${backendUrl}/uploads/${fileName}`} // Usando o nome do arquivo
                                                    width="300"
                                                    height="400"
                                                    title={`Prévia do PDF ${index}`}
                                                ></iframe>
                                            </div>
                                        ) : fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.txt') ? (
                                            <div>
                                                <p>{fileName}</p>
                                                <a href={`${backendUrl}/uploads/${fileName}`} target="_blank" rel="noopener noreferrer">
                                                    Abrir documento
                                                </a>
                                            </div>
                                        ) : (
                                            <p>{fileName}</p> // Apenas exibe o nome do arquivo se não for imagem, PDF ou documento
                                        )}
                                    </div>
                                    
                                    );
                                })
                            ) : (
                                <p>Nenhum arquivo anexado</p>
                            )}
                        </div>
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
