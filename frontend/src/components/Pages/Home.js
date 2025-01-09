import styles from './Home.module.css'
import LinkButton from '../Layout/LinkButton'
import { Link } from "react-router-dom";
import { ReactComponent as Logo} from "../../img/logo-project-semFundo.svg";

function Home(){
    return(
        <section className={styles.home_container}>
            <div className={styles.text_section}>
                <h1>TRABALHE <span>ONLINE</span></h1>
                <h2>Trabalhe de Casa</h2>
                <p>
                    Descubra uma nova maneira de gerenciar seus projetos diretamente do conforto da sua casa. 
                    Planeje, organize e execute projetos com eficiência e elegância.
                </p>
                <LinkButton para="/NovoProjeto" texto="Criar Projeto" />
            </div>
            <div className={styles.logo_section}>
                <Link to="/">
                    <Logo className={styles.logo} />
                </Link>
            </div>
        </section>
    )
}

export default Home
