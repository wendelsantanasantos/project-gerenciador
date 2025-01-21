import styles from "./Contato.module.css";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";


function Contato() {
    return (
        
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quer entrar em contato?</h1>
                <p>Gostaríamos muito de ouvir você. Veja como nos contatar.</p>
            </div>

            <div className={styles.cards}>
                <div className={styles.card + " " + styles.card1}>
                    <h2>Perguntas gerais</h2>
                    <p>Envie uma mensagem usando o formulário abaixo e entraremos em contato dentro de um dia útil.</p>
                    <a href="/Home" className={styles.button}>Entre em contato</a>
                </div>

                <div className={styles.card + " " + styles.card2}>
                    <h2>Redes Sociais</h2>
                    <p>Siga-nos nas redes sociais e fique por dentro das novidades.</p>
                    <p>
                        <a href="https://www.instagram.com" className={styles.link}>
                        <FaInstagram />
                        INSTAGRAM
                        </a><br />
                        <a href="https://www.facebook.com" className={styles.link}>
                        <FaFacebook />
                        FACEBOOK
                        </a><br />
                        <a href="https://www.whatsapp.com" className={styles.link}>
                        <FaWhatsapp />
                        WHATSAPP
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Contato;
