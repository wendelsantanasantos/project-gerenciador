import style from './NovoProjeto.module.css'
import ProjectForm from '../project/projectForm'
import { useNavigate } from 'react-router-dom'
import Imagen from '../../img/imgProject.png'

function NovoProjeto() {
    const navigate = useNavigate()

    function criarPost(project) {
        project.cost = 0
        project.tasks = []
        project.services = []

        fetch('http://localhost:5000/projects', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
            credentials: 'include'
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            navigate('/MeusProjetos', { state: { mensagem: 'Projeto criado com sucesso!', type: 'success' } })
        })
        .catch((erro) => {
            console.log(erro)
            navigate('/MeusProjetos', { state: { mensagem: 'Erro ao criar projeto!', type: 'error' } })
        })
    }

    return (
        <div className={style.newproject_container}>
            
            <div className={style.imgContainer}><img src={Imagen} alt="" /></div>

            <ProjectForm handleSubmit={criarPost} btnText="Criar projeto" />
            
        </div>
    )
}

export default NovoProjeto
