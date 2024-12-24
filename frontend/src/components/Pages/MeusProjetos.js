import Mensagem from "../Layout/Mensagem";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LinkButton from "../Layout/LinkButton";
import Container from "../Layout/Container";
import style from "./MeusProjetos.module.css";
import ProjectCard from "../project/projectCard";
import Loading from "../Layout/Loading";
import SideBar from "../Layout/sideBar";


function MeusProjetos() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [Msg, settMsg] = useState("");

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((resp) => {
          if (resp.status === 401) {
            window.location.href = "/login";
            return null; // Retorna null para evitar erro ao chamar resp.json()
          }
          return resp.json();
        })
        .then((data) => {
          if (data) {
            // Verifica se data não é null
            setProjects(data);
          }
          setRemoveLoading(true);
        })
        .catch((err) => console.log("Erro ao buscar projetos:", err));
    }, 1000);
  }, []);
  function removerProjeto(id) {
    settMsg("");
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => String(project.id) !== String(id))
        );

        console.log("Projeto removido com sucesso!");
        settMsg("Projeto removido com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  const location = useLocation();

  let mensagem = "";
  let type = "";
  if (location.state) {
    mensagem = location.state.mensagem;
    type = location.state.type;
  }
  return (
    <>
    <SideBar/>
    <div className={style.meusProjetos_container}>
      <div className={style.meusProjetos_header}>
        <h1>Meus Projetos</h1>
        <LinkButton para="/NovoProjeto" texto="Criar Projeto" />
      </div>

      {mensagem && <Mensagem type={type} msg={mensagem} />}

      {Msg && <Mensagem type={type} msg={Msg} />}
     <Container customClass="start">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              prazo={project.end_date}
              budget={project.budget}
              category={project.category}
              handleRemove={removerProjeto}
            />
          ))
        ) : !removeLoading ? (
          <Loading />
        ) : (
          <p>Não há projetos cadastrados</p>
        )}
      </Container>
    </div>
    </>
  );
}

export default MeusProjetos;
