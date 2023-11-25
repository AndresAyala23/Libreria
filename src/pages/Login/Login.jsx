import { useState } from 'react';
import './Login.css'
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import Swal from 'sweetalert2'

export const Login = ({saveUsuarioToLocalStorage, navigate}) => {

  const [form, setForm] = useState({
    "email": "",
    "password": ""
  })

  const onChangeField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const LOGIN = gql(`
    query MyQuery($email: String!, $password: String!) {
      userLoginValidation(email: $email, password: $password) {
        id
        email
        role
        userName
      }
    }
  `);

  const [loginUser, { loading, error, data, variables }] = useLazyQuery(LOGIN, {
    onCompleted: (data) => {

      const success = (data.userLoginValidation) ? true : false;

      if (success == false) {
        Swal.fire('Error', 'Usuario o contraseña incorrecta!', 'error');
      } else {
        const usuario = data.userLoginValidation
        Swal.fire('¡BIENVENIDO!', `Hola, ${usuario.userName}`, 'success')
        .then((respuesta) => {
          saveUsuarioToLocalStorage(usuario)
        })
      }
    },
    onError: (error) => {
      // console.error('Error:', error);
      Swal.fire('Error', 'Oops', `${error}`);
    }
  });

  const onSubmitF = (e) => {
    e.preventDefault();
    loginUser({variables: {email: form.email,password: form.password}})
  };


  return (
    <div id="loginDiv" className='d-flex flex-column align-items-center justify-content-center'>
      <div className="card d-flex justify-content-center align-items-center col-11 col-md-5" id='cardLogin'>

        {
          (loading == false)
            ? 
            <>
            <h1>Iniciar sesión</h1>
            <form className="col-12 d-flex justify-content-center flex-wrap align-items-center" onSubmit={onSubmitF}>
              <div className="col-12 col-md-9 mt-5">
                  <label htmlFor="emailInput" className='form-label fw-bold'>Correo electrónico: </label>
                  <input type="email" className="form-control" id="emailInput" name='email' value={form.email} onChange={onChangeField}></input>
              </div>
              <div className="col-12 col-md-9 mt-3">
                  <label htmlFor="passwordInput" className='form-label fw-bold'>Contraseña: </label>
                  <input type="password" className="form-control" id="passwordInput" name='password' value={form.password} onChange={onChangeField} minLength={4} required></input>
              </div>

              <button type='submit' className='col-12 col-md-9 mt-4 btn btn-primary'>Ingresar</button>
              <a className='fw-bolder text-danger mt-5 text-decoration-none cursor-pointer' onClick={() => {navigate('/register')}}>¿Aún no tienes una cuenta? ¡Únete ahora!</a>
            </form>
            </>
            : 
            <>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </>
        }
        
      </div>
    </div>
  )
}
