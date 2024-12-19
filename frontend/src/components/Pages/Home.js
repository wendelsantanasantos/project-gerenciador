import styles from './Home.module.css'
import imagem from '../../img/savings.svg'
import LinkButton from '../Layout/LinkButton'

function Home(){
    return(
        <section className={styles.home_container}>
            <h1>Bem-vindo ao <span>Cost</span></h1>
            <p>Começe a gerenciar seus projetos agora mesmo!</p>
            <LinkButton para="/NovoProjeto" texto="Criar Projeto"/>
            <img src={imagem} alt="Cost" />
        </section>
    )
}

export default Home