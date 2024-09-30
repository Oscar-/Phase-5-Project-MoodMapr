import React, { useState, useEffect } from 'react';

function Trip() {
  // State for fetching trips
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for AI chatbot
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch trips 
  useEffect(() => {
    fetch('http://localhost:5555/trips') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        return response.json();
      })
      .then(data => {
        setTrips(data); 
      })
      .catch(error => {
        setError('Error fetching trips: ' + error.message);
      })
      .finally(() => {
        setLoading(false);  
      });
  }, []);

  // Handle delete trip
  const handleDelete = (tripId) => {
    fetch(`http://localhost:5555/trips/${tripId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete trip');
        }
        return response.json();
      })
      .then(() => {
        
        setTrips(trips.filter(trip => trip.id !== tripId));
      })
      .catch(error => {
        setError('Error deleting trip: ' + error.message);
      });
  };

  // Handle AI prompt change
  const handleAiPromptChange = (e) => {
    setAiPrompt(e.target.value);
  };

  // Handle AI submission
  const handleAiSubmit = (e) => {
    e.preventDefault();
    setAiLoading(true);
    setError('');

    fetch('http://localhost:5555/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ prompt: aiPrompt }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then(data => {
        setAiResponse(data.text);
      })
      .catch(error => {
        setError(`Error fetching AI text: ${error.message}`);
        console.error('AI request error:', error);
      })
      .finally(() => {
        setAiLoading(false);
      });
  };

  if (loading) {
    return <p className="loading">Loading your trips...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="trip-container">
      <h2>Your Trips</h2>
      {trips.length === 0 ? (
        <p className="no-trips">You have no trips reserved.</p>
      ) : (
        <div className="trip-list">
          {trips.map(trip => (
            <div key={trip.id} className="trip-card">
              <img src={trip.place.image} alt={trip.place.name} />
              <h3>{trip.place.name}</h3>
              <p>{trip.place.description}</p>
              <a href={trip.place.link} target="_blank" rel="noopener noreferrer" className="visit-link">Visit</a>
              <button className="delete-button" onClick={() => handleDelete(trip.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <h2>Plan your trip using AI support</h2>
      <form className="ai-form" onSubmit={handleAiSubmit}>
        <div>
          <label htmlFor="aiPrompt">Ask me anything:</label>
          <input
            type="text"
            id="aiPrompt"
            value={aiPrompt}
            onChange={handleAiPromptChange}
            required
            className="ai-input"
          />
        </div>
        <button type="submit" className="ai-button" disabled={aiLoading}>
          {aiLoading ? 'Generating...' : 'Generate Text'}
        </button>
      </form>
      {aiResponse && (
        <div className="ai-response">
          <h3>AI Response:</h3>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default Trip;
