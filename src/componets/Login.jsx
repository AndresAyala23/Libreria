// Login.js

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

// Importa tu mutación de login de Apollo Client
import LOGIN_MUTATION from './path-to-your-mutation';

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: ({ login }) => {
      // Verifica el tipo de usuario y redirige en consecuencia
      if (login.isAdmin) {
        history.push('/admin');
      } else {
        history.push('/user');
      }
    },
    onError: (error) => {
      // Maneja errores de autenticación
      console.error('Error during login:', error);
    },
  });

  const handleLogin = () => {
    // Llama a la mutación de login con las credenciales proporcionadas
    loginMutation({
      variables: { username, password },
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
