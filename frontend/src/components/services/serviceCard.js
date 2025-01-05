
import styles from './serviceCard.module.css'
import {BsFillTrashFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'


function ServiceCard({ id, name, cost, description, handleRemove }) {

    const navigate = useNavigate(); // Certifique-se de que está dentro de um componente funcional.

const redirect = (e) => {
  if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
    navigate(`/services/${id}`); 
  }
};

    function Remove(e) {
        e.preventDefault()
        handleRemove(id, cost)
    }


    return (
        <div className={styles.projectCard} onClick={redirect}>

            <h4>{name}</h4>
            <p>
               <span>Custo total:</span> {cost}
            </p>
            <p>{description}</p>
            <div className={styles.projectCard_actions}>

                <button onClick={Remove}><BsFillTrashFill /> Excluir</button>
            </div>

        </div>
    )
}

export default ServiceCard