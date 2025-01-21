import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import Input from "../formComponents/input";
import SubmitBtn from "../formComponents/submit";
import { useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";



function Login({ handleSubmit, btnText, userData }) {
  const [user, setUser] = useState(userData || { email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function Submit(e) {
    e.preventDefault();
  
    // Verificação se os campos estão vazios
    if (!user.email || !user.password) {
      setMsg("Preencha todos os campos");
      return;
    }
    console.log(user);
  
    // Enviando os dados para o servidor
    fetch("http://localhost:5000/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include", 
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json(); 
        } else if (resp.status === 401) {
          return resp.json().then((data) => {
            setMsg(data.message || "Erro ao realizar login, E-mail ou senha incorretos!");
            throw new Error(data.message || "E-mail ou senha incorretos");
          });
        } else {
          return resp.json().then((data) => {
            setMsg(data.message || "Erro ao realizar login!");
            throw new Error("Erro desconhecido no servidor");
          });
        }
      })
      .then((data) => {
        console.log(data);
        setMsg("Login realizado com sucesso!");
        window.location.href = "/MeusProjetos"; // Redirecionar para a página de projetos
      })
      .catch((erro) => {
        console.log(erro);
        // Se ocorrer erro, a mensagem será exibida pelo `setMsg` acima.
      });
  }
  
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  function togglePasswordVisibility(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
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

    <div className={styles.showPassword}>
      
      <Input
        type={showPassword ? "text" : "password"}
        text="Senha"
        name="password"
        placeholder="Insira a senha"
        handleOnChange={handleChange}
      />
      <div className={styles.eye} onClick={togglePasswordVisibility}>
      {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
    </div>

    </div>


        <SubmitBtn text="Entrar" />
      </form>

     
                    <div className={styles.google} onClick={handleGoogleLogin}>
                    <FcGoogle /><p>Google</p>
                    </div>
                
              
      {msg && <p className={styles.msg}>{msg}</p>}
      <p>
        Não possui uma conta? <Link to="/CadastroUser">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;
