import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Pages/Home";
import Contato from "./components/Pages/Contato";
import Empresa from "./components/Pages/Empres";
import NovoProjeto from "./components/Pages/NovoProjeto";
import Container from "./components/Layout/Container";
import NavBar from "./components/Layout/NavBar";
import SideBar from "./components/Layout/sideBar";
import Footer from "./components/Layout/Footer";
import MeusProjetos from "./components/Pages/MeusProjetos"
import ProjetosEquipe from "./components/Pages/ProjetosEquipe"
import Projeto from "./components/Pages/Projeto";
import Login from "./components/Pages/Login";
import CadastroUser from "./components/Pages/CadastroUser";
import ServicePage from "./components/services/servicePage";

function App() {
  return (
    <Router>
      <NavBar/>
      <SideBar/>
      <Container customClass="minHeigth">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Empresa" element={<Empresa />} />
          <Route path="/Contato" element={<Contato />} />
          <Route path="/NovoProjeto" element={<NovoProjeto />} />
          <Route path="/MeusProjetos" element={<MeusProjetos />} />
          <Route path="/ProjetosEquipe" element={<ProjetosEquipe />} />
          <Route path="/projeto/:id" element={<Projeto />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CadastroUser" element={<CadastroUser />} />
        </Routes>
      </Container>
      <Footer/>
    </Router>
  );
}

export default App;
