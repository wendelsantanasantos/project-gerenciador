import styles from './Home.module.css'
import LinkButton from '../Layout/LinkButton'
import logo from '../../img/logo_projeto_2.png'

function Home(){
    return(
        <section className={styles.home_container}>
            <h1>Bem-vindo ao <span>UniProj</span></h1>
            <p>Começe a gerenciar seus projetos agora mesmo!</p>
            <LinkButton para="/NovoProjeto" texto="Criar Projeto"/>
            <img src={logo} alt="Cost"/>
        </section>
    )
}

export default Home