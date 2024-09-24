import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5555/places/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setPlace(data))
      .catch(error => {
        setError('Error fetching place details');
        console.error('Fetch error:', error);
      });
  }, [id]);

  return (
    <div className="detail-container">
      {error && <p className="error-message">{error}</p>}
      {place ? (
        <div className="detail-card">
          <div className="image">
            {place.image && <img src={place.image} alt={place.name} />}
          </div>
          <div className="details">
            <h2>{place.name}</h2>
            <p>{place.description}</p>
            <a href={place.link} className="detail-link" target="_blank" rel="noopener noreferrer">Visit</a>
          </div>
        </div>
      ) : (
        <p>Loading place details...</p>
      )}
    </div>
  );
}

export default PlaceDetail;
