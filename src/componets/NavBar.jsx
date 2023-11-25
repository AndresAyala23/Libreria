import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../NavBar.css";
import logo from '../img/logo1.png'
import { HamburgetMenuClose, HamburgetMenuOpen } from "../Icons";

function NavBar({usuario, cerrarSesion}) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
          <img src={logo} alt="example"/>
          </NavLink>
          <h2>BIENVENIDO <span className='text-danger'>{usuario.userName}</span> 🚀</h2>
         <br/>
         <button className='btn btn-danger' onClick={() => {cerrarSesion()}}>Cerrar sesión</button>
         <br />

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/libros"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Libros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/crear"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Registro
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/contact"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
              <span className="icon">
                <HamburgetMenuOpen />{" "}
              </span>
            ) : (
              <span className="icon">
                <HamburgetMenuClose />
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
