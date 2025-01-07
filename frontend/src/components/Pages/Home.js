import styles from './Home.module.css'
import LinkButton from '../Layout/LinkButton'
import { Link } from "react-router-dom";
import { ReactComponent as Logo} from "../../img/logo-project-semFundo.svg";

function Home(){
    return(
        <section className={styles.home_container}>
            <h1>Bem-vindo ao <span>NEXU</span></h1>
            <p>Começe a gerenciar seus projetos agora mesmo!</p>
            <LinkButton para="/NovoProjeto" texto="Criar Projeto"/>
            <Link to="/">
          <Logo className={styles.logo}/>
        </Link>
        </section>
    )
}

export default Home