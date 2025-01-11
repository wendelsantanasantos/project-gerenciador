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
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [isAdm, setIsAdm] = useState(false); 

    const backendUrl = "http://localhost:5000"; // URL base do backend

    useEffect(() => {
       
        const isAdmin = localStorage.getItem('isAdm') === 'true';
        setIsAdm(isAdmin);

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
    }, [id]);

    function editService(service){

        setMsg('')

      fetch(`http://localhost:5000/projects/services/${id}/edit`, {
        method:'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(service),
        credentials: 'include'
      })
      .then((resp) => resp.json())
      .then((data) => {
        setService(data)
        setShowServiceForm(false)
        setMsg('Serviço atualizado!')
        setType('success')
      })
      .catch(
        (erro) => console.log(erro))
      
    }

    const toggleServiceForm = () => {
        setShowServiceForm(prevState => !prevState);
    };

    const handleAddService = (formData) => {
        console.log("Dados do formulário:", formData);
    };

    
    function foramatarData(data) {
        const novaData = data.replace(/-/g, '/');
        return novaData
    }

    function isImage(fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }
    function getFileName(filePath) {
        return filePath.replace(/^.*[\\\/]/, '');
    }


    return (
        <>
            {msg && <p className={`${styles.message} ${styles[type]}`}>{msg}</p>}
            {service ? (
                <div className={styles.service_details}>
                    <h1>{service.name}</h1>
                    <p><strong>Descrição:</strong> {service.description}</p>
                    <p><strong>Data do serviço:</strong> {foramatarData(service.date)}</p>
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
                                    handleSubmit={editService}
                                    projectData={service}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                             <p><strong>Arquivos Anexados:</strong></p>
                             <div className={styles.filesContainer}>
                                 {service.files && service.files.length > 0 ? (
                                                    service.files.map((filePath, index) => {
                                                        const fileName = getFileName(filePath)
                                                        return (
                                                            <div key={index} className={styles.filesCard}>
                                                                {isImage(fileName) ? (
                                                                    <img
                                                                        src={`${backendUrl}/uploads/${fileName}`} // Usando o nome do arquivo
                                                                        alt={`Imagem anexada ${index}`}
                                                                        className={styles.previewImage}
                                                                    />
                                                                ) : fileName.toLowerCase().endsWith('.pdf') ? (
                                                                    <div>
                                                                        <p>{fileName}</p>
                                                                        <iframe
                                                                            src={`${backendUrl}/uploads/${fileName}`} // Usando o nome do arquivo
                                                                            width="300"
                                                                            height="400"
                                                                            title={`Prévia do PDF ${index}`}
                                                                        ></iframe>
                                                                    </div>
                                                                ) : (
                                                                    <p>{fileName}</p> // Apenas exibe o nome do arquivo se não for imagem ou PDF
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p>Nenhum arquivo anexado</p>
                                                )}
                                            </div>
                                        </div>

                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default ServicePage;
