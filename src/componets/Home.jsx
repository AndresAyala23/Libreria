import React from 'react'
import { useQuery, gql } from '@apollo/client';
import Carousel from 'react-bootstrap/Carousel';

const Home = () => {
    const IMG = gql`
    query libros {
      getBooksList {
        image
      }
    }
  `;

  const { loading, error, data } = useQuery(IMG);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const images = data.getBooksList.map(book => book.image);

  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={image}
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};


export default Home;