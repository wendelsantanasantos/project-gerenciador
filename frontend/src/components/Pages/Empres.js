import styles from './Empresa.module.css';
import { ReactComponent as Logo } from "../../img/logo-project-semFundo.svg";
import imgTeam from '../../img/team-img.png';
import teamPhoto from '../../img/team-img.png';
import { IoDiamondSharp } from "react-icons/io5";
import { VscCircuitBoard } from "react-icons/vsc";
import { HiUserGroup } from "react-icons/hi2";




const Empresa = () => {
    return (
        <section className={styles.empresa_container}>
            
            <div className={styles.container1}>
                <div className={styles.text_section}>
                    <h1>
                        <span>Nexus </span> Nossa História
                    </h1>
                    <p>
                        A Nexus surgiu da necessidade de criar uma plataforma que realmente conectasse equipes 
                        e facilitasse a gestão de projetos. Desde o início, nosso foco sempre foi entregar uma 
                        solução intuitiva, prática e adaptada às demandas do mercado.
                    </p>

                </div>
                <Logo className={styles.logo}  />

            </div>

            {/* Seção de Valores */}
            <section className={styles.values_section}>
                <h2>Valores que nos guiam</h2>
                <div className={styles.values_list}>
                    <div className={styles.value_item}>
                        <VscCircuitBoard className={styles.circuit}/>
                        <h3>Inovação</h3>
                        <p>
                            Estamos sempre em busca de novas tecnologias e metodologias para oferecer 
                            soluções melhores e mais eficientes.
                        </p>
                    </div>
                    <div className={styles.value_item}>
                        <HiUserGroup className={styles.users}/>
                        <h3>Colaboração</h3>
                        <p>
                            Acreditamos que o trabalho em equipe é a chave para o sucesso, e criamos o Nexus 
                            para facilitar a colaboração em todos os níveis.
                        </p>
                    </div>
                    <div className={styles.value_item}>
                        <IoDiamondSharp className={styles.diamond} />
                        <h3>Qualidade</h3>
                        <p>
                            Garantimos um alto padrão de qualidade em todos os aspectos da plataforma, 
                            da interface ao suporte ao cliente.
                        </p>
                    </div>
                </div>
            </section>

            {/* Seção de Sobre o Time */}
            <section className={styles.team_section}>
                <h2>Nosso Time</h2>
                <div className={styles.team_info}>
                    <div className={styles.text_team}>
                        <p>
                            A equipe por trás do Nexus é composta por profissionais apaixonados por tecnologia, 
                            gestão de projetos e inovação. Cada membro traz uma experiência única que contribui 
                            para a evolução constante da plataforma.
                        </p>
                    </div>
                  
                </div>
            </section>

        </section>
    );
}

export default Empresa;
