import styles from "./Contato.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Contato() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quer entrar em contato?</h1>
                <p>Gostaríamos muito de ouvir você. Veja como nos contatar.</p>
            </div>

            <div className={styles.cards}>
                <div className={styles.card}>
                    <h2>Perguntas gerais</h2>
                    <p>Envie uma mensagem usando o formulário abaixo e entraremos em contato dentro de um dia útil.</p>
                    <a href="#" className={styles.button}>Entre em contato</a>
                </div>

                <div className={styles.card}>
                    <h2>Redes Sociais</h2>
                    <p>Siga-nos nas redes sociais e fique por dentro das novidades.</p>
                    <p>
                        <a href="#" className={styles.link}>
                            <FontAwesomeIcon icon={faInstagram}/> INSTAGRAM
                        </a><br />
                        <a href="#" className={styles.link}>
                            <FontAwesomeIcon icon={faFacebook} /> FACEBOOK
                        </a><br />
                        <a href="#" className={styles.link}>
                            <FontAwesomeIcon icon={faWhatsapp} /> WHATSAPP
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contato;
