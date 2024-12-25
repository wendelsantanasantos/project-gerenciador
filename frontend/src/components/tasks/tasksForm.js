import styles from './tasksForm.module.css'
import Input from '../formComponents/input'
import SubmitBtn from '../formComponents/submit'

import { IoShareOutline } from "react-icons/io5";
import { useState } from 'react'

function TasksForm({ handleSubmit, btnText, projectData }) {

    const [task, setTask] = useState({});
    const [file, setFile] = useState([]);


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

        // Adiciona os arquivos ao FormData
        file.forEach(f => formData.append('file', f));

        // Faz a requisição para o backend com o FormData
        fetch(`http://localhost:5000/projects/${projectData.id}/tasks`, {
            method: 'POST',
            body: formData,  // Envia o FormData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tarefa criada:', data);
            handleSubmit(data);  // Passa a tarefa de volta, se necessário
        })
        .catch(error => {
            console.error('Erro ao criar tarefa:', error);
        });
    };

    function handleChange(e) {
        if (e.target.type === "file") {
            const newFiles = Array.from(e.target.files); // Converte FileList em array
            setFile((prevFiles) => [...prevFiles, ...newFiles]); // Adiciona os novos arquivos ao estado
        } else {
            setTask({ ...task, [e.target.name]: e.target.value });
        }
    }

    const isImage = (file) => {
        return file && file.type.startsWith("image/");
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Nome da tarefa" name="name" placeholder="Insira o nome da tarefa" handleOnChange={handleChange} />
            <Input type="text" text="Prioridade da tarefa" name="prioridade" placeholder="Insira a prioridade da tarefa" handleOnChange={handleChange} />
            <Input type="date" text="Prazo da tarefa" name="prazo" placeholder="Insira o prazo da tarefa" handleOnChange={handleChange} />
            <Input type="number" text="Custo da tarefa" name="cost" placeholder="Insira o custo da tarefa" handleOnChange={handleChange} />
           

            <Input type="text" text="Descrição da tarefa" name="descricao" placeholder="Insira a descrição da tarefa" handleOnChange={handleChange} />
            <Input type="text" text="Status da tarefa" name="status" placeholder="Insira o status da tarefa" handleOnChange={handleChange} />
            
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
