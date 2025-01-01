import styles from './tasksForm.module.css'
import Input from '../formComponents/input'
import SubmitBtn from '../formComponents/submit'
import SearchBar from '../Layout/searchBar';
import { VscAccount } from "react-icons/vsc";
import Select from "../formComponents/select";


import { IoShareOutline } from "react-icons/io5";
import { useState } from 'react'

function TasksForm({ handleSubmit, btnText, projectData }) {

    const [task, setTask] = useState({prioridade  : ''});
    const [file, setFile] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [members, setMembers] = useState([]); 



    const submit = (e) => {
        e.preventDefault();

        if (!projectData.tasks) {
            projectData.tasks = [];
        }

        const formData = new FormData();

        for (const key in task) {
            formData.append(key, task[key]);
        }

        console.log('dados  enviados', projectData.id);

        file.forEach(f => formData.append('file', f));

        members.forEach(member => formData.append('members[]', member));

        fetch(`http://localhost:5000/projects/${projectData.id}/tasks`, {
            method: 'POST',
            body: formData, 
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tarefa criada:', data);
            handleSubmit(data);  
        })
        .catch(error => {
            console.error('Erro ao criar tarefa:', error);
        });
    };

    function handleChange(e) {
        if (e.target.type === "file") {
            const newFiles = Array.from(e.target.files); 
            setFile((prevFiles) => [...prevFiles, ...newFiles]); 
        } else {
            setTask({ ...task, [e.target.name]: e.target.value });
        }
    }

    const isImage = (file) => {
        return file && file.type.startsWith("image/");
    };

    function searchUsers(e) {
        const query = e.target.value;

        if (!query.trim()) {
            setFilteredUsers([]); // Limpa os resultados
            setSearchQuery(''); // Limpa o termo de pesquisa
            return; // Retorna para não fazer a requisição
        }

        setSearchQuery(query);

        fetch(`http://localhost:5000/usersSearch?UserName=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((resp) => resp.json())
            .then((data) => {
                setFilteredUsers(data);
            })
            .catch((erro) => console.log(erro));
    }

    const toggleMember = (userId) => {
    
        setMembers((prevMembers) => {
            if (prevMembers.includes(userId)) {
                return prevMembers.filter((id) => id !== userId);
            } else {
                return [...prevMembers, userId];
            }
        });
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Nome da tarefa" name="name" placeholder="Insira o nome da tarefa" handleOnChange={handleChange} />
            
            <Select
                text="Prioridade da tarefa"
                name="prioridade"
                handleOnChange={handleChange}
                options={[
                    { id: 'Baixa', name: 'Baixa' },
                    { id: 'Media', name: 'Media' },
                    { id: 'Alta', name: 'Alta' },
                ]}
                value={task.prioridade}
            />

            <Input type="date" text="Prazo da tarefa" name="prazo" placeholder="Insira o prazo da tarefa" handleOnChange={handleChange} />

            <Input type="text" text="Descrição da tarefa" name="descricao" placeholder="Insira a descrição da tarefa" handleOnChange={handleChange} />

            <Select 
                text='Status da tarefa'
                name='status'
                handleOnChange={handleChange}
                options={[
                    {id: 'Pendente', name: 'Pendente'},
                    {id: 'Em andamento', name: 'Em andamento'},
                    {id: 'Concluida', name: 'Concluida'},
                ]}
                value={task.status}/>

            <div className={styles.teamContainer}>
    <div className={styles.searchBarContainer}>
        <SearchBar handleSearch={searchUsers} />
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (

            <div  key={user.id}
            className={`${styles.resultsList} ${members.includes(user.id) ? styles.memberAdded : ''}`}
            onClick={() => toggleMember(user.id)}
        >
                <div className={styles.userHeader}>
                    
                    <div className={styles.avatarContainer}>
                    {user.img ? <img src={`http://localhost:5000${user.img}`} alt={user.name} /> : <VscAccount /> }
                    </div>

                    <p>
                    {user.name}
                    </p>
                </div>
                <span>{user.email}</span>

            </div>
            ))
        ) : (
            <p className={styles.noResults}></p>
        )}
    </div>
                </div>
            
            <input type="file" name="arquivo" multiple onChange={handleChange} id="arquivo" />
    
            <label htmlFor="arquivo" className={styles.file_upload_btn}>
                <span>Anexar arquivo</span>
                <IoShareOutline />
            </label>
             
            <div>
                <p><strong>Arquivos Anexados:</strong></p>        
                <div className={styles.filesContainer}>
                    {file.length > 0 ? (
                        file.map((file, index) => (
                            <div key={index} className={styles.filesCard}>
                                {isImage(file) ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Imagem anexada ${index}`}
                                        className={styles.previewImage}
                                    />
                                ) : file.type === "application/pdf" ? (
                                    <div>
                                        <p>{file.name}</p>
                                        <iframe
                                            src={URL.createObjectURL(file)}
                                            width="300"
                                            height="400"
                                            title="Prévia do PDF"
                                        ></iframe>
                                    </div>
                                ) : file.type.startsWith("audio/") ? (
                                    <div>
                                        <p>{file.name}</p>
                                        <audio controls>
                                            <source src={URL.createObjectURL(file)} />
                                            Seu navegador não suporta o elemento de áudio.
                                        </audio>
                                    </div>
                                ) : file.type.startsWith("video/") ? (
                                    <div>
                                        <p>{file.name}</p>
                                        <video controls width="300">
                                            <source src={URL.createObjectURL(file)} />
                                            Seu navegador não suporta o elemento de vídeo.
                                        </video>
                                    </div>
                                ) : (
                                    <p>{file.name}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Nenhum arquivo anexado</p>
                    )}
                </div>
            </div>

            <SubmitBtn text={btnText} />
        </form>
    );
}

export default TasksForm;
