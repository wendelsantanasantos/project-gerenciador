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
function formatStatus(status) {
  const statusMap = {
    planejando: "Planejando",
    "aguardando-aprovacao": "Aguardando aprovação",
    pendente: "Pendente",
    "em-andamento": "Em andamento",
    "em-revisao": "Em revisão",
    concluido: "Concluído",
  };

  return statusMap[status?.toLowerCase()] || "Pendente"; // Retorna "Pendente" por padrão
}



  const remove = (e) => {
    e.preventDefault();
    handleRemove(id);
  };

  const getProgress = (status) => {
    switch (status) {
      case "Planejando":
        return { progress: 10, label: "Planejando" };
      case "Aguardando-aprovacao":
        return { progress: 20, label: "Aguardando aprovação" };
      case "Pendente":
        return { progress: 30, label: "Pendente" };
      case "Em-andamento":
        return { progress: 60, label: "Em andamento" };
      case "Em-revisao":
        return { progress: 80, label: "Em revisão" };
      case "Concluido":
        return { progress: 100, label: "Concluído" };
      default:
        return { progress: 0, label: "Não iniciado" };
    }
  };
  
  const { progress, label } = getProgress(status);
  
  return (
    <div  onClick={redirect}
    className={`${style.projectCard} ${
      style[(status ? status.toLowerCase() : "pendente").toLowerCase()]
    }`}
  >     
      <h4>{name}</h4>

      <div className={style.projectCard_status}>
  <p>{formatStatus(status)}</p>
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
  completed={progress}
  customLabel={label+'%'}
  bgColor="#222"
  baseBgColor="#cadfe2"
  width="100%"
  style={{ marginTop: "2em" }}
/>;

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
