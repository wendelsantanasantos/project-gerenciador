
import styles from '../project/projectCard.module.css'
import {BsFillTrashFill } from 'react-icons/bs'
function ServiceCard({ id, name, cost, description, handleRemove }) {

    function Remove(e) {
        e.preventDefault()
        handleRemove(id, cost)
    }


    return (
        <div className={styles.projectCard}>

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