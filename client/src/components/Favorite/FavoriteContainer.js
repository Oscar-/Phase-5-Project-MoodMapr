import React, { useState, useEffect } from 'react';
import PlaceCard from '../Place/PlaceCard';
import { Link } from 'react-router-dom'; 

function FavoriteContainer() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5555/favorites')
      .then(response => response.json())
      .then(data => setFavorites(data))
      .catch(error => {
        setError(`Error fetching favorites: ${error.message}`);
        console.error('Fetch error:', error);
      });
  }, []);

  const handleDelete = (placeId) => {
    fetch(`http://localhost:5555/favorites/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        place_id: placeId
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete favorite');
      }
      // Re-fetch favorites to ensure the UI is up to date
      return fetch('http://localhost:5555/favorites');
    })
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        // Handle the case when there are no favorites
        setFavorites([]); // Set favorites to an empty array
      } else {
        setFavorites(data); // Update state with the fresh list
      }
    })
    .catch(error => {
      setError(`Error deleting favorite: ${error.message}`);
      console.error('Delete error:', error);
    });
  };
  

  const handleSave = (placeId) => {
    // Your save logic here
    console.log(`Saved place with ID: ${placeId}`);
  };

  return (
    <div className="container">
      <header>
        <h1>My Favorite Places</h1>
      </header>
      
      {favorites.length === 0 ? (
        <p>You have no favorite places yet.</p>
      ) : (
        <section>
          <ul className="cards">
            {favorites.map(favorite => (
              <li key={favorite.id}>
                <PlaceCard 
                  place={favorite} 
                  onSave={handleSave} 
                  onDelete={handleDelete}
                />
                <Link to={`/places/${favorite.id}`} >View Details</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default FavoriteContainer;
