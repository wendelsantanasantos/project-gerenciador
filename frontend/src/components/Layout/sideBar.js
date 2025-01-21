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

  function closeMenu() {
    setShowMenu(false);
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
            <Link to="/MeusProjetos" onClick={closeMenu}>
            <span><BsFileEarmarkTextFill /></span><p>Meus Projetos</p></Link>
          </li>
          <li>
            <Link to="/ProjetosEquipe" onClick={closeMenu}>
            <span><RiTeamFill /></span><p>Colaboração</p></Link>
          </li>
          <li>
            <Link to="/Empresa" onClick={closeMenu}>
             <span>  <BsBriefcaseFill /></span><p>Empresa</p></Link>
          </li>
          <li>
            <Link to="/NovoProjeto" onClick={closeMenu}>
              <span><BsBoxes /></span>
            <p>Novo Projeto</p></Link>
          </li>

          <li>
            <Link to="/Contato" onClick={closeMenu}>
              <span><TbMessage /></span><p>Contato</p></Link>
          </li>

          <li>
            <Link to="/Login" onClick={closeMenu}> <span><VscAccount /></span><p>Login</p></Link>
          </li>
        </ul>
    
            </nav>
        </div>
        {showMenu && <Fade />}
      </>
        
        
    );
}

export default SideBar