import styles from './serviceCard.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function ServiceCard({ id, name, cost, description, isAdm }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdm !== undefined) {
      localStorage.setItem('isAdm', isAdm);  // Armazena no localStorage
    }
  }, [isAdm]);

  const redirect = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
      navigate(`/services/${id}`);
    }
  };

  return (
    <div className={styles.serviceCard} onClick={redirect}>
      <h4>{name}</h4>
      <div className={styles.serviceCard_info}>
      <p>
        <span>Custo total:</span> {cost}
      </p>
      <p> <span>Descrição:</span>{description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;
