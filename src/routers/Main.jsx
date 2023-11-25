import { useEffect, useState } from "react"
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import App from "../App"
import { Login } from "../pages/Login/Login";
import { Registrarse } from "../pages/Login/Registrarse";
export const Main = () => {


  const [usuario, setUsuario] = useState({})
  const [autenticado, setAutenticado] = useState(false)
  const [vista, setVista] = useState('home')

  useEffect(() => {
    const usuario = getLocalStorage('usuario')
    if (usuario) {
      setUsuario(usuario)
      setAutenticado(true)
    } else {
      setUsuario({})
      setAutenticado(false)
    }
  }, [autenticado])

  const saveUsuarioToLocalStorage = (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setAutenticado(true)
  };

  const getLocalStorage = (key) => {
    return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null)
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    setUsuario({})
    setAutenticado(false)
  }

  const navigate = useNavigate();


  return (
    <Routes>
      {
        (autenticado == true) ? (
          <>
            <Route path="/" element={<App usuario={usuario} cerrarSesion={cerrarSesion} vista={vista} setVista={setVista}/>}/>
            <Route path="/*" element={<Navigate to={'/'}/>}/>
          </>
        ): (
          <>
            <Route path="/login" element={<Login saveUsuarioToLocalStorage={saveUsuarioToLocalStorage} navigate={navigate}/> }/>
            <Route path="/register" element={<Registrarse saveUsuarioToLocalStorage={saveUsuarioToLocalStorage} navigate={navigate}/> }/>
            <Route path="*" element={<Navigate to={'/login'} replace={true}/>}/>
          </>
        )
      }
    </Routes>
  )
}