import React from 'react';

function PlaceCard({ place, onSave, onDelete }) {
  return (
    <div className="card">
      <div className="image">
        <img src={place.image} alt={place.name} />
      </div>
      <div className="details">
        <h2>{place.name}</h2>
        <p>{place.description}</p>
        <button className="save-button" onClick={() => onSave(place.id)}>Save</button>
        <button className="remove-button" onClick={() => onDelete(place.id)}>Remove </button> 
      </div>
    </div>
  );
}

export default PlaceCard;
