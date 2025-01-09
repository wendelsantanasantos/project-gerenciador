import style from "./projectCard.module.css";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from "react-router-dom";

function ProjectCard({
  id,
  name,
  budget,
  category,
  handleRemove,
  prazo,
  status,
}) {

  const navigate = useNavigate(); // Certifique-se de que está dentro de um componente funcional.

  const redirect = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
      navigate(`/projeto/${id}`); // Redireciona programaticamente.
    }
  };

  
  function foramatarData(data) {
    const novaData = data.replace(/-/g, '/');
    return novaData
}

  const remove = (e) => {
    e.preventDefault();
    handleRemove(id);
  };
  
  return (
    <div  onClick={redirect}
    className={`${style.projectCard} ${
      style[(status ? status.toLowerCase() : "pendente").toLowerCase()]
    }`}
  >     
      <h4>{name}</h4>

      <div className={style.projectCard_status}>
        <p>{status || "Pendente"}</p>
      </div>

      <div  className={style.projectCard_info}>
      <p>
        <span>Deadline:</span>
        {foramatarData(prazo)}
      </p>
      <p>
        <span>Budget:</span> R${budget}
      </p>
      <p className={style.category_text}>
        <span className={`${style[category.name.toLowerCase()]}`}></span>{" "}
        {category.name}
      </p>

      <div className={style.projectCard_progress}>
        <p>Progress:</p>
        
      <ProgressBar
      
        completed={status === "Concluido" ? 100 : 70}
        customLabel={status === "Concluido" ? "Concluido!" : ""}
        bgColor="#222"
        baseBgColor="#cadfe2"
        width="100%"
        margin-top="2em"
      />
      </div>

      <div className={style.projectCard_actions}>
      
        <button onClick={remove}>
          <BsFillTrashFill /> Delete
        </button>
      </div>
      </div>
    </div>
  );
}

export default ProjectCard;
