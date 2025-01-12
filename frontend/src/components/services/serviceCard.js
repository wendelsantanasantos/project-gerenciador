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
    <div className={styles.projectCard} onClick={redirect}>
      <h4>{name}</h4>
      <p>
        <span>Custo total:</span> {cost}
      </p>
      <p>{description}</p>
    </div>
  );
}

export default ServiceCard;
