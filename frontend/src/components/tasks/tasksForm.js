import styles from './tasksForm.module.css';
import Input from '../formComponents/input';
import SubmitBtn from '../formComponents/submit';
import SearchBar from '../Layout/searchBar';
import { VscAccount } from "react-icons/vsc";
import Select from "../formComponents/select";
import { IoShareOutline } from "react-icons/io5";
import { useState, useEffect } from 'react';

function TasksForm({ handleSubmit, btnText, projectData, taskToEdit }) {
    // Estado para os dados da tarefa
    const [task, setTask] = useState({
        name: taskToEdit?.name || "",
        prioridade: taskToEdit?.prioridade || "",
        prazo: taskToEdit?.prazo || "",
        descricao: taskToEdit?.descricao || "",
        status: taskToEdit?.status || "",
    });

    // Estado para arquivos e membros
    const [file, setFile] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [members, setMembers] = useState([]);

    const backendUrl = "http://localhost:5000"; // URL base do backend

    // Função de envio do formulário
    const submit = (e) => {
        e.preventDefault();

        // Verificar se pelo menos um membro foi selecionado
        if (members.length === 0) {
            alert("Por favor, escolha pelo menos um membro para a tarefa.");
            return;
        }

        // Verificar se o nome da tarefa foi preenchido
        if (!task.name) {
            alert("Por favor, insira o nome da tarefa.");
            return;
        }

        const formData = new FormData();
        for (const key in task) {
            if (task[key]) formData.append(key, task[key]);
        }
        file.forEach((f) => formData.append("file", f));
        members.forEach((member) => formData.append("members[]", member));
        formData.append("projectId", projectData.id);

        if (taskToEdit?.id) {
            formData.append("taskId", taskToEdit.id);
        }

        // Exibir dados do FormData no console
        console.log("Dados do FormData:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // Chamar o handleSubmit com os dados do formulário
        handleSubmit(formData);
    };

    useEffect(() => {
        if (taskToEdit) {
            setTask({
                name: taskToEdit.name || "",
                prioridade: taskToEdit.prioridade || "",
                prazo: taskToEdit.prazo || "",
                descricao: taskToEdit.descricao || "",
                status: taskToEdit.status || "",
            });
            setMembers(taskToEdit.members || []);
            
            // Verifica se os arquivos são URLs ou objetos
            if (taskToEdit.files && typeof taskToEdit.files[0] === 'string') {
                // Se for uma URL, armazena como está (caso o arquivo já esteja no banco)
                setFile(taskToEdit.files);
            } else {
                // Se for um objeto de arquivo, processa como novo arquivo
                setFile(taskToEdit.files || []);
            }
        }
    }, [taskToEdit]);
    
    
    // Função para lidar com mudanças nos campos do formulário
    function handleChange(e) {
        if (e.target.type === "file") {
            const newFiles = Array.from(e.target.files);
            setFile((prevFiles) => [...prevFiles, ...newFiles]);
        } else {
            setTask({ ...task, [e.target.name]: e.target.value });
        }
    }


    function getFilePreview(file) {
        // Verifica se o arquivo é uma URL de imagem (no caso de edição, já vindo do banco de dados)
        if (typeof file === 'string') {
            // Se for uma string, considera que é uma URL e retorna diretamente
            return file;
        }
    
        // Caso contrário, trata como se fosse um arquivo normal (como uma imagem ou PDF)
        const fileType = file.type.split('/')[0]; // Obter tipo do arquivo (image, pdf, etc)
        
        if (fileType === 'image') {
            return URL.createObjectURL(file); // Para imagens, cria a URL local para visualização
        }
        
        if (fileType === 'application' && file.type.endsWith('pdf')) {
            return URL.createObjectURL(file); // Para PDFs, cria a URL local
        }
        return null;
    }
    
    // Função de pesquisa de usuários
    function searchUsers(e) {
        const query = e.target.value;
        if (!query.trim()) {
            setFilteredUsers([]);
            setSearchQuery('');
            return;
        }

        setSearchQuery(query);
        fetch(`http://localhost:5000/usersSearch?UserName=${query}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
            .then((resp) => resp.json())
            .then((data) => setFilteredUsers(data))
            .catch((erro) => console.log(erro));
    }

    // Função para alternar a seleção de membros
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
            <Input type="text" text="Nome da tarefa" name="name" placeholder="Insira o nome da tarefa" handleOnChange={handleChange} value={task.name} />
            <Select
                text="Prioridade da tarefa"
                name="prioridade"
                handleOnChange={handleChange}
                options={[{ id: 'Baixa', name: 'Baixa' }, { id: 'Media', name: 'Media' }, { id: 'Alta', name: 'Alta' }]}
                value={task.prioridade}
            />
            <Input type="date" text="Prazo da tarefa" name="prazo" placeholder="Insira o prazo da tarefa" handleOnChange={handleChange} value={task.prazo} />
            <Input type="text" text="Descrição da tarefa" name="descricao" placeholder="Insira a descrição da tarefa" handleOnChange={handleChange} value={task.descricao} />
            <Select
                text="Status da tarefa"
                name="status"
                handleOnChange={handleChange}
                options={[{ id: 'Pendente', name: 'Pendente' }, { id: 'Em andamento', name: 'Em andamento' }, { id: 'Concluida', name: 'Concluída' }]}
                value={task.status}
            />

            <div className={styles.teamContainer}>
                <div className={styles.searchBarContainer}>
                    <SearchBar handleSearch={searchUsers} />
                    {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id}
                                 className={`${styles.resultsList} ${members.includes(user.id) ? styles.memberAdded : ''}`}
                                 onClick={() => toggleMember(user.id)}>
                                <div className={styles.userHeader}>
                                    <div className={styles.avatarContainer}>
                                        {user.img ? <img src={`http://localhost:5000${user.img}`} alt={user.name} /> : <VscAccount />}
                                    </div>
                                    <p>{user.name}</p>
                                </div>
                                <span>{user.email}</span>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noResults}>Nenhum usuário encontrado</p>
                    )}
                </div>
            </div>

            <input type="file" name="arquivo" multiple onChange={handleChange} id="arquivo" />
            <label htmlFor="arquivo" className={styles.file_upload_btn}>
                <span>Anexar arquivo</span>
                <IoShareOutline />
            </label>

            <div className={styles.fileContainer}>
    <p><strong>Arquivos Anexados:</strong></p>
    <div>
        {file.length > 0 ? (
            file.map((file, index) => {
                const preview = getFilePreview(file);
                return (
                    <div key={index}>
                        {/* Exibindo a prévia do arquivo */}
                        {file.type && file.type.startsWith('image') ? (
                            <img
                                src={preview}
                                alt={`Prévia da imagem ${index}`}
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                        ) : file.type && file.type.endsWith('pdf') ? (
                            <div>
                                <p>{file.name}</p>
                                <iframe
                                    src={preview}
                                    width="300"
                                    height="400"
                                    title={`Prévia do PDF ${index}`}
                                ></iframe>
                            </div>
                        ) : (
                            <p>{file.name}</p>
                        )}
                    </div>
                );
            })
        ) : (
            <p>Nenhum arquivo selecionado</p>
        )}
    </div>
</div>


            <SubmitBtn text={btnText} />
        </form>
    );
}

export default TasksForm;
