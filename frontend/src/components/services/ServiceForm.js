import styles from '../project/projectForm.module.css'
import Input from '../formComponents/input'
import SubmitBtn from '../formComponents/submit'
import { useState, useEffect } from 'react'

function ServiceForm({ handleSubmit, btnText, projectData }) {

    // Inicialize o estado com os dados de projectData
    const [service, setService] = useState(() => projectData || {}); 

    const submit = (e) => {
        e.preventDefault();

        // Inclua projectData no envio, caso necessário
        const updatedService = {
            ...projectData,
            ...service,
        };

        console.log('Dados do serviço enviados:', updatedService); // Verifique no console
        handleSubmit(updatedService);
    };

    function handleChange(e) {
        setService({ ...service, [e.target.name]: e.target.value });
    }

    // Atualize o estado se projectData mudar (opcional)
    useEffect(() => {
        if (projectData) {
            setService((prev) => ({ ...prev, ...projectData }));
        }
    }, [projectData]);

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                value={service.name || ''} // Preserve o valor existente
                handleOnChange={handleChange}
            />
            <Input
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o custo do serviço"
                value={service.cost || ''} // Preserve o valor existente
                handleOnChange={handleChange}
            />
            <Input
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Insira a descrição do serviço"
                value={service.description || ''} // Preserve o valor existente
                handleOnChange={handleChange}
            />
            <Input
                type="date"
                text="Data do serviço"
                name="date"
                placeholder="Insira a data do serviço"
                value={service.date || ''} // Preserve o valor existente
                handleOnChange={handleChange}
            />
            <SubmitBtn text={btnText} />
        </form>
    );
}

export default ServiceForm;
