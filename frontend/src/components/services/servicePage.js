import styles from './servicePage.module.css'
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../Layout/Loading";

function ServicePage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
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
    }, [id]);

    return (
        <>
            {msg && <p className={`${styles.message} ${styles[type]}`}>{msg}</p>}
            {service ? (
                <div className={styles.service_details}>
                    <h1>{service.name}</h1>
                    <p><strong>Descrição:</strong> {service.description}</p>
                    <p><strong>Data:</strong> {service.date}</p>
                    <p><strong>Custo:</strong> R$ {service.cost}</p>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default ServicePage;
