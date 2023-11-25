import { useQuery, gql } from '@apollo/client';
import React from 'react';
import Home from './componets/Home'
import Libros from './componets/Libros'
import Crear from './componets/Crear'
import NavBar from './componets/NavBar';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'



export default function App({usuario, cerrarSesion, vista, setVista}) {

  const vistas = {
    "home": <Home/>,
    "crear": <Crear/>,
    "libros": <Libros/>
  }

  return (
    <>
        <NavBar usuario={usuario} cerrarSesion={cerrarSesion} vista={vista} setVista={setVista}/>
        <div className="pages">
        {
          //! Si existe la vista la renderiza, si no muestra el home
          vistas[vista] || <Home/>
        }
      </div>
  </>
  );
}



const GET_USUARIOS= gql`
query Usuarios{
  getUsersList{
    id
  userName
  email
   role
  password
  books {
    id
  }
}
}
`;
function UserNames() {
  const { loading, error, data } = useQuery(GET_USUARIOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log(data)

 /*  return(
    data && data.getUsersList.map(name => name.userName). join(',')
  ) */

   return data.getUsersList.map(({id, userName, email}) => (
    <div key={id}>
      <h3>{userName}</h3>
      <br />
      <p>{email}</p>
    </div>
  )); 
}
