import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../NavBar.css";
import logo from '../img/logo1.png'
import { HamburgetMenuClose, HamburgetMenuOpen } from "../Icons";

function NavBar({ usuario, cerrarSesion, vista, setVista }) {
  const [click, setClick] = useState(false);

  const handleClick = (nombreVista) => setVista(nombreVista);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink to="/" className="nav-logo">
            <img src={logo} alt="example" />
          </NavLink>
          <h2>BIENVENIDO <span className='text-danger'>{usuario.userName}</span> 🚀</h2>
          <br />
          <button className='btn btn-danger' onClick={() => { cerrarSesion() }}>Cerrar sesión</button>
          <br />

          <ul className={click ? "nav-menu" : "nav-menu"}>
            <li className="nav-item">
              <NavLink

                to="/"
                className="nav-links"
                onClick={() => {handleClick('home')}}
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink

                to="/libros"
                className="nav-links"
                onClick={() => {handleClick('libros')}}
              >
                Libros
              </NavLink>
            </li>


            {/* EJEMPLO DE RUTA ADMIN */}

            {
              // rol admin o user
              (usuario.role == "user")
                ?
                <li className="nav-item">
                  <NavLink

                    to="/crear"
                    className="nav-links"
                    onClick={() => {handleClick('crear')}}
                  >
                    Registro
                  </NavLink>
                </li>
                :
                ''
            }




            <li className="nav-item">
              <NavLink

                to="/contact"
                className="nav-links"
                onClick={handleClick}
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
          <div className="nav-icon" onClick={() => {handleClick('contactanos')}}>
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
