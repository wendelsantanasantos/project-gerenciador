import { useState } from 'react';
import styles from './tasks.module.css';
import { BsFillTrashFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function Tasks({ id, name, cost, descricao, prioridade, prazo, responsaveis, status, files = [], handleRemove }) {
     
    const navigate = useNavigate();

    function Remove(e) {
        e.preventDefault();
        handleRemove(id, cost);
    }

    const redirect = (e) => {
        if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
          navigate(`/tasks/${id}`);
        }
    }

    return (
        <div  className={`${styles.Task} ${
              styles[(status ? status.toLowerCase() : "pendente").toLowerCase()]
            }`} onClick={redirect}>
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
           
            <div className={styles.task_actions} onClick={Remove}>
                <button><BsFillTrashFill /> Excluir</button>
            </div>
        </div>
    );
}

export default Tasks;

