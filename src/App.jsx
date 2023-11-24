import { useQuery, gql } from '@apollo/client';
import React from 'react';



export default function App() {
  return (
    <div>
    <h2>My first Apollo app ejemplo  🚀</h2>
    <br/>
    <UserNames/>
  </div>
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
