import React from 'react';


function PlaceCard({ place }) {
  return (
    <div className="card">
      <div className="image">
        <img src={place.image} alt={place.name} />
      </div>
      <div className="details">
        <h2>{place.name}</h2>
        <p>{place.description}</p>
      </div>
    </div>
  );
}

export default PlaceCard;
