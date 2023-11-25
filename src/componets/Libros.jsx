import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// Definir la consulta GraphQL
const GET_BOOKS = gql`
  query libros {
    getBooksList {
      id
      title
      image
      description
      copies
      autor
      year
    }
  }
`;

// Definir la mutación GraphQL
const ADD_BOOK_TO_USER = gql`
  mutation AddBookToUser($id: ID!, $user_id: Int!, $copies: Int!) {
    addBooktoUser(id: $id, user_id: $user_id, copies: $copies) {
      id
      title
      image
      description
      copies
      autor
      year
      user {
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
  }
`;

const BookList = () => {
  // Realizar la consulta a la API GraphQL
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="container-fluid mt-4">
        <h2 className="text-center">Libros disponibles</h2>
        <div className="col-12 mt-3 d-flex flex-wrap gap-2 px-2 justify-content-center">
          {data.getBooksList.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BookCard = ({ book }) => {
  const [isBorrowed, setBorrowed] = React.useState(false);

  // Agrega la mutación GraphQL para asociar el libro a un usuario y cambiar su estado
  const [addBookToUser] = useMutation(ADD_BOOK_TO_USER, {
    variables: { id: book.id, user_id: 1, copies: 1 }, // Ajusta el user_id según tu lógica
    onError: (error) => {
      console.error('Error al solicitar préstamo:', error.message);
    },
    update: (cache, { data: { addBookToUser } }) => {
      // Actualiza el estado local para reflejar que el libro está prestado
      setBorrowed(true);

      // Puedes realizar una actualización manual de la caché aquí si es necesario
      // Por ejemplo, podrías leer la caché y actualizar la lista de libros prestados
    },
  });

  const handleButtonClick = async () => {
    try {
      // Llama a la mutación para asociar el libro al usuario y cambiar su estado
      await addBookToUser();
    } catch (error) {
      console.error('Error al solicitar préstamo:', error.message);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="col-12 mt-3 d-flex flex-wrap gap-2 px-2 justify-content-center">
        <div className="col-12 col-md-4 col-lg-3 col-xxl-2 my-2">
          <div className="card w-100">
            <img src={book.image} alt={book.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
            <div className="card-body">
              <h5 className="card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {book.title}
              </h5>
              <p className="card-text" style={{ maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {book.description}
              </p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <b>Autor: </b>
                {book.autor}
              </li>
              <li className="list-group-item" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <b>Año: </b>
                {book.year}
              </li>
              <li className="list-group-item" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <b>Disponible: </b> {book.copies}
              </li>
            </ul>
            <button className="btn btn-outline-dark" onClick={handleButtonClick}>
              {isBorrowed ? 'Devolver' : 'Solicitar préstamo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
