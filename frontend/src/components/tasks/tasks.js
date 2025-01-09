import { useState } from 'react';
import styles from './tasks.module.css';
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';


function Tasks({ id, name, cost, descricao, prioridade, prazo, responsaveis, status, files = [], handleRemove }) {
    const backendUrl = "http://localhost:5000"; // URL base do backend

    const [showFiles, setShowFiles] = useState(false); // Estado para controlar a visibilidade dos arquivos
    
    const navigate = useNavigate();


    function Remove(e) {
        e.preventDefault();
        handleRemove(id, cost);
    }

    const redirect = (e) => {
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
          navigate(`/tasks/${id}`);
        }
      };

    function isImage(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }
    function getFileName(filePath) {
        return filePath.replace(/^.*[\\\/]/, '');
    }
    const toggleFilesVisibility = () => {
        setShowFiles(!showFiles);
    };

    

    return (
        <div className={styles.Task }   onClick={redirect}>

            <div className={styles.taskHeader}>
                <h4>{name}</h4>
                <div className={styles.statusTask}>
                    <p><span>Status:</span>{status}</p>
                </div>

                 <div className={styles.prioridade}><p><span>Prioridade:</span>{prioridade}</p></div>
            </div>

            <p><span>Prazo:</span>{prazo}</p>
            <p><span>Descrição:</span>{descricao}</p>
            <p><span>Responsáveis:</span>{responsaveis}</p>
            {/* Botão para mostrar/ocultar os anexos */}
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
                                            ) : (
                                                <p>{fileName}</p> // Apenas exibe o nome do arquivo se não for imagem ou PDF
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

            <div className={styles.task_actions} onClick={Remove}>
                <button><BsFillTrashFill /> Excluir</button>
            </div>
        </div>
    );
}

export default Tasks;
