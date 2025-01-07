import styles from './servicePage.module.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../Layout/Loading";
import ServiceForm from './ServiceForm'; // Importando o componente do formulário de serviço

function ServicePage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState('');
    const [showServiceForm, setShowServiceForm] = useState(false); // Para controlar a exibição do formulário
    const [isAdm, setIsAdm] = useState(false); // Estado inicial como 'false'

    useEffect(() => {
        // Verifica se o usuário é administrador assim que o componente é montado
        const isAdmin = localStorage.getItem('isAdm') === 'true';
        setIsAdm(isAdmin); // Atualiza o estado de isAdm

        // Faz a requisição para buscar o serviço
        fetch(`http://localhost:5000/services/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`Erro ao buscar o serviço: ${resp.status}`);
            }
            return resp.json();
        })
        .then((data) => {
            setService(data);
        })
        .catch((error) => {
            console.error(error.message);
            setMsg('Erro ao carregar os dados do serviço!');
            setType('error');
        });
    }, [id]); // O useEffect vai ser executado apenas quando o id mudar

    const toggleServiceForm = () => {
        setShowServiceForm(prevState => !prevState);
    };

    const handleAddService = (formData) => {
        console.log("Dados do formulário:", formData);
    };

    return (
        <>
            {msg && <p className={`${styles.message} ${styles[type]}`}>{msg}</p>}
            {service ? (
                <div className={styles.service_details}>
                    <h1>{service.name}</h1>
                    <p><strong>Descrição:</strong> {service.description}</p>
                    <p><strong>Data do serviço:</strong> {service.date}</p>
                    <p><strong>Custo total:</strong> R$ {service.cost}</p>

                    <div className={styles.services_form_container}>
                        {isAdm && (
                            <button onClick={toggleServiceForm} className={styles.btn}>
                                {!showServiceForm ? 'Editar Serviço' : 'Fechar'}
                            </button>
                        )}
                        {showServiceForm && (
                            <div className={styles.project_info}>
                                <ServiceForm
                                    btnText="Editar Serviço"
                                    handleSubmit={handleAddService}
                                    projectData={service}
                                />
                            </div>
                        )}
                    </div>

                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default ServicePage;
