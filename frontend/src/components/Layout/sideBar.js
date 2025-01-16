import styles from './sideBar.module.css'
import { useState } from "react";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { PiListBold } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { BsBriefcaseFill } from "react-icons/bs";
import { BsBoxes } from "react-icons/bs";
import { TbMessage } from "react-icons/tb";
import Fade from './Fade';
import { useLocation } from "react-router-dom";





function SideBar() {

  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);

  function showMenuBtn() {
    setShowMenu(!showMenu);
  }
    if (location.pathname === "/") {
      return null;
    }

    return (
      <>
      <div className={`${styles.sidebar} ${showMenu ? styles.sidebarOpen :styles.sidebarClose}`}>
        <nav className={styles.menu}>
        

        <div className={styles.logoContainer}>
                  
                      <PiListBold onClick={showMenuBtn} className={`${styles.menuIcon} ${showMenu ? styles.iconRotate :styles.menuIcon}`}/>
        </div>
        
        <ul>
          <li>

            <Link to="/">
            <span><IoMdHome /></span>
            <p>Home</p>
            </Link>
          </li>
          <li>
            <Link to="/MeusProjetos">
            <span><BsFileEarmarkTextFill /></span><p>My Projects</p></Link>
          </li>
          <li>
            <Link to="/ProjetosEquipe">
            <span><RiTeamFill /></span><p>Collaborators</p></Link>
          </li>
          <li>
            <Link to="/Empresa">
             <span>  <BsBriefcaseFill /></span><p>Company</p></Link>
          </li>
          <li>
            <Link to="/NovoProjeto">
              <span><BsBoxes /></span>
            <p>New Project</p></Link>
          </li>

          <li>
            <Link to="/Contato">
              <span><TbMessage /></span><p>Contact</p></Link>
          </li>

          <li>
            <Link to="/Login"> <span><VscAccount /></span><p>Login</p></Link>
          </li>
        </ul>
    
            </nav>
        </div>
        {showMenu && <Fade />}
      </>
        
        
    );
}

export default SideBar