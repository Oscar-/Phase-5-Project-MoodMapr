
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PlaceContainer() {  
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/places') 
      .then(response => response.json())
      .then(data => setPlaces(data));
  }, []);

  return (
    <div>
      <h1>Explore Places</h1>
      <div className="place-grid">
        {places.map(place => (
          <div key={place.id} className="place-card">
            <Link to={`/places/${place.id}`}>
              <img src={place.image} alt={place.name} className="place-image" />
              <h3>{place.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceContainer;
