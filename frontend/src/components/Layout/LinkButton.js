import { Link } from "react-router-dom";
import styles from './LinkButton.module.css'

function LinkButton({para, texto}){
    return(
        <Link className={styles.linkbutton} to={para}>
            {texto}
        </Link>
    )
}

export default LinkButton