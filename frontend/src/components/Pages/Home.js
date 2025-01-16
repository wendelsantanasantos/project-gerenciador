import styles from './Home.module.css'
import LinkButton from '../Layout/LinkButton'
import { Link } from "react-router-dom";
import { ReactComponent as Logo} from "../../img/logo-project-semFundo.svg";
import { useEffect } from 'react';
import { initParticles } from '../Layout/Particles'; 
import imgTeam from '../../img/team-img.png'
import { FaTasks } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";




function Home() {
    useEffect(() => {     
        initParticles(); 
    }, []);

    return (
        <section className={styles.home_container}>
            <canvas id="particles-js" className={styles.particles_canvas}></canvas>
            
            <div  className={styles.container1}>
            <div className={styles.text_section}>

<h1><span>    Nexus  </span> Conecte Sua Equipe e Transforme Seus Projetos</h1>

<h2></h2>

 <p>
     Descubra uma nova maneira de gerenciar seus projetos diretamente do conforto da sua casa. 
     Planeje, organize e execute projetos com eficiência e elegância.
 </p>
 <LinkButton para="/NovoProjeto" texto="Comece Agora" className={styles.button}/>

</div>

<div className={styles.img_section}>
     <img src={imgTeam} alt="Imagem de um time" />
 </div>
            </div>

                      {/* Seção de funcionalidades */}
            <section className={styles.features_section}>
                <h2>Tudo que voce precisa em um só lugar</h2>
                <div className={styles.features_list}>
                    <div className={styles.feature_item}>
                        <AiOutlineFundProjectionScreen />
                        <h3>Gestão de Projetos</h3>
                        <p>Crie Projetos complexos e acompanhe o andamento do seu trabalho juntamente com sua equipe.</p>
                    </div>
                    <div className={styles.feature_item}>
                    <FaTasks />

                        <h3>Criação de Tarefas</h3>
                        <p>Crie tarefas personalizadas para cada membro da equipe com prioridades, prazos,compartilhamento de arquivos e responsáveis.</p>
                    </div>
                 
                    <div className={styles.feature_item}>
                        <MdAttachMoney />
                        <h3>Controle de Orçamento</h3>
                        <p>Gerencie os custos do seu projeto e garanta que ele se mantenha dentro do orçamento, evitando surpresas no final.</p>
                    </div>
                </div>
            </section>

            {/* Seção de vantagens */}
            <section className={styles.advantages_section}>
                <h2>Vantagens de Usar o Nexus</h2>
                <div className={styles.advantages_list}>
                    <div className={styles.advantage_item}>
                        <h3>Facilidade de Uso</h3>
                        <p>Com uma interface intuitiva, qualquer membro da equipe pode começar rapidamente, sem precisar de treinamento.</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <h3>Flexibilidade</h3>
                        <p>Adaptável a diferentes tipos de projetos e equipes, com funcionalidades customizáveis para se adequar às suas necessidades.</p>
                    </div>
                    <div className={styles.advantage_item}>
                        <h3>Escalabilidade</h3>
                        <p>Cresça com o seu projeto! Nexus é ideal tanto para pequenas equipes quanto para grandes organizações.</p>
                    </div>
                </div>
            </section>
            
        </section>

        
    );
}

export default Home;
