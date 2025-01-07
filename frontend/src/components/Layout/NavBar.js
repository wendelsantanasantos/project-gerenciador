import { Link } from "react-router-dom";
import Styles from "./NavBar.module.css";
import { ReactComponent as Logo} from "../../img/logo-project-semFundo.svg";
import { VscAccount } from "react-icons/vsc";



function NavBar() {


  return (
    <nav className={Styles.navbar}>

        <Link to="/">
          <Logo className={Styles.logo}/>
        </Link>

        <ul className={Styles.list}>
          <li>
            <Link to="/">Home</Link>
          </li>
          
          <li>
            <Link to="/Contato">Contato</Link>
          </li>

          <li>
            <Link to="/Login"> <span><VscAccount /></span> Login</Link>
          </li>
        </ul>
    </nav>
  );
}

export default NavBar;
