import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import Input from "../formComponents/input";
import SubmitBtn from "../formComponents/submit";
import { useState } from "react";

function Login({ handleSubmit, btnText, userData }) {
  const [user, setUser] = useState(userData || { email: "", password: "" });
  const [msg, setMsg] = useState("");

  function Submit(e) {
    e.preventDefault();

    if (!user.email || !user.password) {
      setMsg("Preencha todos os campos");
      return;
    }
    console.log(user);

    fetch("http://localhost:5000/Login", {
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
        setMsg("Login realizado com sucesso!");
        window.location.href = "/MeusProjetos";
      })
      .catch((erro) => {
        console.log(erro);
        setMsg("Erro ao realizar login!");
      });
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <form onSubmit={Submit}>
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

        <SubmitBtn text="Entrar" />
      </form>
      {msg && <p className={styles.msg}>{msg}</p>}
      <p>
        Não possui uma conta? <Link to="/CadastroUser">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;
