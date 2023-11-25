import { useState } from 'react';
import './Login.css'
import { useQuery, gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2'

export const Registrarse = ({saveUsuarioToLocalStorage, navigate}) => {

  const [form, setForm] = useState({
    "email": "",
    "password": "",
    "userName": ""
  })

  const onChangeField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const REGISTRAR = gql(`
    mutation MyMutation($email: String!, $password: String!, $userName: String!) {
      createUser(email: $email, password: $password, userName: $userName) {
        id
        role
        userName
        email
      }
    }
  `);

  const [createUser, { loading, error, data, variables }] = useMutation(REGISTRAR, {
    onCompleted: (data) => {

      const success = data && data.createUser;

      if (success == false) {
        Swal.fire('Error', 'Ha ocurrido un error interno, vuelve a intentarlo más tarde', 'error');
      } else {
        const usuario = data.createUser
        Swal.fire('¡BIENVENIDO!', `Hola, ${usuario.userName}`, 'success')
        .then((respuesta) => {
          saveUsuarioToLocalStorage(usuario)
        })
      }
    },
    onError: (error) => {
      // console.error('Error:', error);
      Swal.fire('Error', `${error}`, 'error');
      console.log(error)
    }
  });

  const onSubmitF = (e) => {
    e.preventDefault();
    createUser({variables: {email: form.email,password: form.password, userName: form.userName}})
  };


  return (
    <div id="loginDiv" className='d-flex flex-column align-items-center justify-content-center'>
      <div className="card d-flex justify-content-center align-items-center col-11 col-md-5" id='cardLogin'>

        {
          ( loading == false)
            ? 
            <>
            <h1>Registrarse</h1>
            <form className="col-12 d-flex justify-content-center flex-wrap align-items-center" onSubmit={onSubmitF}>
              <div className="col-12 col-md-9 mt-5">
                  <label htmlFor="emailInput" className='form-label fw-bold'>Correo electrónico: </label>
                  <input type="email" className="form-control" id="emailInput" name='email' value={form.email} onChange={onChangeField}></input>
              </div>
              <div className="col-12 col-md-9 mt-3">
                  <label htmlFor="userNameInput" className='form-label fw-bold'>Username: </label>
                  <input type="text" className="form-control" id="userNameInput" name='userName' value={form.userName} onChange={onChangeField} minLength={10}></input>
              </div>
              <div className="col-12 col-md-9 mt-3">
                  <label htmlFor="passwordInput" className='form-label fw-bold'>Contraseña: </label>
                  <input type="password" className="form-control" id="passwordInput" name='password' value={form.password} onChange={onChangeField} minLength={8} required></input>
              </div>

              <button type='submit' className='col-12 col-md-9 mt-4 btn btn-success'>Registrarse</button>
              <a className='fw-bolder text-danger mt-5 text-decoration-none cursor-pointer' onClick={() => {navigate('/login')}}>¿Ya tienes cuenta? ¡Inicia sesión!</a>
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
