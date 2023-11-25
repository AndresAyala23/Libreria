import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// Definir la consulta GraphQL para obtener la lista de libros
const GET_BOOKS = gql`
  query {
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

// Definir la mutación GraphQL para agregar un nuevo libro
const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $image: String!
    $description: String!
    $autor: String!
    $copies: Int
    $year: String!
  ) {
    createBook(
      title: $title
      image: $image
      description: $description
      autor: $autor
      copies: $copies
      year: $year
    ) {
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

// Definir la mutación GraphQL para actualizar un libro
const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: ID!
    $title: String
    $image: String
    $description: String
    $autor: String
    $copies: Int
    $year: String
  ) {
    updateBook(
      id: $id
      title: $title
      image: $image
      description: $description
      autor: $autor
      copies: $copies
      year: $year
    ) {
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

// Definir la mutación GraphQL para eliminar un libro
const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

const BookList = () => {
  // Realizar la consulta para obtener la lista de libros
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <AddBookForm />
      <BookTable books={data.getBooksList} />
    </div>
  );
};

/* const BookTable = ({ books }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Image</th>
          <th>Description</th>
          <th>Copies</th>
          <th>Autor</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>
              <img src={book.image} alt={book.title} style={{ maxWidth: '50px' }} />
            </td>
            <td>{book.description}</td>
            <td>{book.copies}</td>
            <td>{book.autor}</td>
            <td>{book.year}</td>
            <td>
              <button onClick={() => handleEdit(book)}>Editar</button>
              <button onClick={() => handleDelete(book.id)}>Anular</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; */

const BookTable = ({ books }) => {
    const [editingBook, setEditingBook] = useState(null);
    const [editedBookData, setEditedBookData] = useState({});
  
    const [updateBook] = useMutation(UPDATE_BOOK, {
      update(cache, { data: { updateBook } }) {
        // Actualizar la caché después de editar un libro
        const { getBooksList } = cache.readQuery({ query: GET_BOOKS });
        const updatedBooksList = getBooksList.map((book) =>
          book.id === updateBook.id ? updateBook : book
        );
        cache.writeQuery({
          query: GET_BOOKS,
          data: { getBooksList: updatedBooksList },
        });
  
        setEditingBook(null);
        setEditedBookData({});
      },
    });
  
    const [deleteBook] = useMutation(DELETE_BOOK, {
      update(cache, { data: { deleteBook } }) {
        // Actualizar la caché después de eliminar un libro
        const { getBooksList } = cache.readQuery({ query: GET_BOOKS });
        const updatedBooksList = getBooksList.filter((book) => book.id !== deleteBook.id);
        cache.writeQuery({
          query: GET_BOOKS,
          data: { getBooksList: updatedBooksList },
        });
  
        setEditingBook(null);
        setEditedBookData({});
      },
    });
  
    const handleEdit = (book) => {
      setEditingBook(book);
      setEditedBookData({ ...book });
    };
  
    const handleCancelEdit = () => {
      setEditingBook(null);
      setEditedBookData({});
    };
  
    const handleInputChange = (e, key) => {
      const { value } = e.target;
      setEditedBookData((prevData) => ({ ...prevData, [key]: value }));
    };
  
    const handleSaveEdit = async () => {
      try {
        const { id, title, image, description, copies, autor, year } = editedBookData;
  
        await updateBook({
          variables: { id, title, image, description, copies, autor, year },
        });
      } catch (error) {
        console.error('Error al guardar cambios editados:', error.message);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteBook({ variables: { id } });
      } catch (error) {
        console.error('Error al eliminar libro:', error.message);
      }
    };
  
    return (
       
      <table class="table table-striped table-dark">
        <thead>
          <tr className=' text-center'>
            <th>Title</th>
            <th>Image</th>
            <th>Description</th>
            <th>Copies</th>
            <th>Autor</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                {editingBook === book ? (
                  <input
                    type="text"
                    value={editedBookData.title || ''}
                    onChange={(e) => handleInputChange(e, 'title')}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editingBook === book ? (
                  <input
                    type="text"
                    value={editedBookData.image || ''}
                    onChange={(e) => handleInputChange(e, 'image')}
                  />
                ) : (
                  <img src={book.image} alt={book.title} style={{ maxWidth: '50px' }} />
                )}
              </td>
              <td>
                {editingBook === book ? (
                  <input
                    type="text"
                    value={editedBookData.description || ''}
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                ) : (
                  book.description
                )}
              </td>
              <td>
                {editingBook === book ? (
                  <input
                    type="number"
                    value={editedBookData.copies || ''}
                    onChange={(e) => handleInputChange(e, 'copies')}
                  />
                ) : (
                  book.copies
                )}
              </td>
              <td>
                {editingBook === book ? (
                  <input
                    type="text"
                    value={editedBookData.autor || ''}
                    onChange={(e) => handleInputChange(e, 'autor')}
                  />
                ) : (
                  book.autor
                )}
              </td>
              <td>
                {editingBook === book ? (
                  <input
                    type="text"
                    value={editedBookData.year || ''}
                    onChange={(e) => handleInputChange(e, 'year')}
                  />
                ) : (
                  book.year
                )}
              </td>
              <td>
                {editingBook === book ? (
                  <>
                    <button onClick={handleSaveEdit} className='btn btn-info'>Guardar</button>
                    <button onClick={handleCancelEdit} className='btn btn-danger'>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(book)} className='btn btn-info '>Editar</button>
                    <button onClick={() => handleDelete(book.id)} className='btn btn-danger'>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    copies: 0,
    autor: '',
    year: '',
  });

  const [createBook] = useMutation(CREATE_BOOK, {
    update(cache, { data: { createBook } }) {
      // Actualizar la caché después de agregar un nuevo libro
      const { getBooksList } = cache.readQuery({ query: GET_BOOKS });
      cache.writeQuery({
        query: GET_BOOKS,
        data: { getBooksList: [...getBooksList, createBook] },
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const intValue = name === 'copies' ? parseInt(value, 10) : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: intValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Llamar a la mutación para agregar un nuevo libro
    createBook({ variables: { ...formData } });
    // Limpiar el formulario después de la acción
    setFormData({
      title: '',
      image: '',
      description: '',
      copies: 0,
      autor: '',
      year: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Añadir nuevo libro</h2>
     
       <label>
        Titulo:
        <input  className='form-control mb-2'  type="text" name="title"
        placeholder='Ingrese el Titulo'
        value={formData.title} onChange={handleInputChange} />
      </label> 
      <label>
        Imagen URL:
        <input className='form-control mb-2' type="text" name="image" 
        placeholder='Ingrese la Imagen URL'
        value={formData.image} onChange={handleInputChange} />
      </label>
      <label>
        Descripcion:
        <input
          type="text"
          name="description"
          className='form-control mb-2'
          placeholder='Ingrese la Description'
          value={formData.description}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Copias:
        <input type="number" name="copies" 
        className='form-control mb-2'
        placeholder='Ingrese la Description'
        value={formData.copies} onChange={handleInputChange} />
        
      </label>
      <label>
        Autor:
        <input type="text" name="autor" 
        className='form-control mb-2'
        placeholder='Ingrese la Description'
        value={formData.autor} onChange={handleInputChange} />
      </label>
      <label>
        Año:
        <input type="text" name="year" 
        className='form-control mb-2'
        placeholder='Ingrese la Description'
        value={formData.year} onChange={handleInputChange} />
      </label>
      <button type="submit" className='btn btn-outline-dark'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"></path>
      </svg>
      <i>    </i>
        Añadir libro</button>
      <h2>Lista De libros</h2>
    </form>
    
  );
};

/* const handleEdit = (book) => {
  // Implementa la lógica para editar un libro aquí
  // Puedes utilizar la mutación UPDATE_BOOK
  console.log('Editar libro:', book);
};

const handleDelete = (id) => {
  // Implementa la lógica para eliminar un libro aquí
  // Puedes utilizar la mutación DELETE_BOOK
  console.log('Eliminar libro con ID:', id);
}; */



export default BookList;
