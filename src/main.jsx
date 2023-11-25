import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import './App.css'
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, HttpLink } from '@apollo/client';
import { Login } from './pages/Login/Login';
import {Main} from './routers/Main'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
  uri: 'http://127.0.0.1:8000/graphql'
  })
});


 /*  const query = gql`
        query Usuarios{
          getUserById (id:4){
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
    `
  
    client.query({query})
  .then(result =>{console.log(result.data)}) */

  const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  </BrowserRouter>
);