import styles from '../project/projectForm.module.css'
import Input from '../formComponents/input'
import SubmitBtn from '../formComponents/submit'
import { useState } from 'react'

function ServiceForm({ handleSubmit, btnText, projectData }) {

    // Alteração: inicializar service como objeto vazio
    const [service, setService] = useState({}) 

    const submit = (e) => {
        e.preventDefault()
        // Enviar o serviço para o backend
        handleSubmit(service)
    }

    function handleChange(e) {
        // Atualiza o estado do serviço com base nos campos preenchidos
        setService({ ...service, [e.target.name]: e.target.value })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o custo do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Insira a descrição do serviço"
                handleOnChange={handleChange}
            />
            <Input
                type="date"
                text="Data do serviço"
                name="date"
                placeholder="Insira a data do serviço"
                handleOnChange={handleChange}
            />
            <SubmitBtn text={btnText} />
        </form>
    )
}

export default ServiceForm
