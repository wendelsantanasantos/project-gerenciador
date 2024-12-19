import styles from './Loading.module.css'

import loading from '../../img/loading.svg'

function Loading(){
    return(
        <div className={styles.loading_container}>
            <img className={styles.loading} src={loading} alt="imagens de loading" />
        </div>
        )

}

export default Loading