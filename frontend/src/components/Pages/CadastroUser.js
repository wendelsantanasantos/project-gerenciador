import styles from "./CadastroUser.module.css";
import { Link } from "react-router-dom";
import Input from "../formComponents/input";
import SubmitBtn from "../formComponents/submit";
import { useState } from "react";
import { BsPersonPlusFill } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";


function CadastroUser({ userData }) {

  const [user, setUser] = useState(
    userData || { name: "", email: "", password: "", imgPerson: "" }
  );
  const [msg, setMsg] = useState("");
  const [imgPerson, setImgPerson] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function Submit(e) {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      setMsg("Preencha todos os campos");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    
    if(imgPerson){
      formData.append("imgPerson", imgPerson);
    }

    fetch("http://localhost:5000/CadastroUser", {
      method: "POST",
      body: formData,
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

  function togglePasswordVisibility(e) {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (
    <div className={styles.CadastroUser}>
      <form onSubmit={Submit}  encType="multipart/form-data">


      <div className={styles.imgPerson_container} onChange={(e) => setImgPerson(e.target.files[0])}>
        <input
              type="file"
              name="imgPerson"
              accept="image/*"
               id="imgPerson"
               className={styles.imgPerson}
          />
          <label htmlFor="imgPerson" className={styles.imgPerson_label}>

            {imgPerson ? <img src={URL.createObjectURL(imgPerson)} alt="Imagem de perfil" /> :
            <BsPersonPlusFill size={32} />
            }
                
          </label>
      </div>




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
