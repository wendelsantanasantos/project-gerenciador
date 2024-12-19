import styles from "./CadastroUser.module.css";
import { Link } from "react-router-dom";
import Input from "../formComponents/input";
import SubmitBtn from "../formComponents/submit";
import { useState } from "react";

function CadastroUser({ handleSubmit, btnText, userData }) {
  const [user, setUser] = useState(
    userData || { name: "", email: "", password: "" }
  );
  const [msg, setMsg] = useState("");

  function Submit(e) {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      setMsg("Preencha todos os campos");
      return;
    }
    fetch("http://localhost:5000/CadastroUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setMsg("Cadastro realizado com sucesso!");
      })
      .catch((erro) => {
        console.log(erro);
        setMsg("Erro ao cadastrar usuario!");
      });
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div className={styles.CadastroUser}>
      <h1>Cadastrar Usuário</h1>
      <form onSubmit={Submit}>
        <Input
          type="text"
          text="Nome"
          name="name"
          placeholder="Insira o nome"
          handleOnChange={handleChange}
        />
        <Input
          type="email"
          text="E-mail"
          name="email"
          placeholder="Insira o e-mail"
          handleOnChange={handleChange}
        />

        <Input
          type="password"
          text="Senha"
          name="password"
          placeholder="Insira a senha"
          handleOnChange={handleChange}
        />

        <SubmitBtn text="Cadastrar" />
      </form>
      {msg && <p className={styles.msg}>{msg}</p>}

      <p>
        Já possui uma conta? <Link to="/Login">Login</Link>
      </p>
    </div>
  );
}

export default CadastroUser;
