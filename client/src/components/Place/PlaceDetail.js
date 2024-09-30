import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newImage, setNewImage] = useState('');  

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

  // Function to handle reservation
  const handleReservation = () => {
    fetch('http://localhost:5555/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        place_id: id,  
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage('Place reserved successfully!');
      }
    })
    .catch(error => {
      console.error('Reservation error:', error);
      setMessage('Error making reservation');
    });
  };

  // Function to handle image update
  const handleImageUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5555/places/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: newImage,  
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Place updated successfully') {
        setPlace(prevPlace => ({
          ...prevPlace,
          image: newImage,  
        }));
        setMessage('Image updated successfully!');
      } else {
        setMessage('Error updating image');
      }
    })
    .catch(error => {
      console.error('Image update error:', error);
      setMessage('Error updating image');
    });
  };

  return (
    <div className="detail-container">
      {error && <p className="error-message">{error}</p>}
      {message && <p className="message">{message}</p>}
      {place ? (
        <div className="detail-card">
          <div className="image">
            {place.image && <img src={place.image} alt={place.name} />}
          </div>
          <div className="details">
            <h2>{place.name}</h2>
            <p>{place.description}</p>
            <a href={place.link} className="detail-link" target="_blank" rel="noopener noreferrer">Visit</a>
            <button onClick={handleReservation} className="reserve-button">Reserve</button>

          
            <form onSubmit={handleImageUpdate} className="update-image-form">
              <input
                type="text"
                placeholder="Enter new image URL"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                required
              />
              <button type="submit" className="update-button">Update Image</button>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading place details...</p>
      )}
    </div>
  );
}

export default PlaceDetail;
