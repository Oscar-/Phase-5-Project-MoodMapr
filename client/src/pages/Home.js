import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import SearchBar from '../SearchBar';
import MoodContainer from '../components/Mood/MoodContainer'; 
import PlaceCard from '../components/Place/PlaceCard'; 

function Home() {
  const [moods, setMoods] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5555/moods')
      .then(response => response.json())
      .then(data => setMoods(data))
      .catch(error => {
        setError(`Error fetching moods: ${error.message}`);
        console.error('Fetch error:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5555/places')
      .then(response => response.json())
      .then(data => {
        setAllPlaces(data);
        setFilteredPlaces(data);
      })
      .catch(error => {
        setError(`Error fetching places: ${error.message}`);
        console.error('Fetch error:', error);
      });
  }, []);

  useEffect(() => {
    if (!selectedMood) {
      setFilteredPlaces(allPlaces);
      return;
    }

    setFetching(true);
    fetch(`http://localhost:5555/places/by_mood?mood=${encodeURIComponent(selectedMood)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setFilteredPlaces(data))
      .catch(error => {
        setError(`Error fetching places: ${error.message}`);
        console.error('Fetch error:', error);
      })
      .finally(() => setFetching(false));
  }, [selectedMood, allPlaces]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSave = (placeId) => {
    fetch('http://localhost:5555/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ place_id: placeId }), 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        console.log(`Place ${placeId} saved to favorites`);
        alert("Place saved to favorites!");
      })
      .catch(error => {
        setError(`Error saving place: ${error.message}`);
        console.error('Fetch error:', error);
      });
  };

  const handleDelete = (placeId) => {
    fetch(`http://localhost:5555/places/${placeId}`, {  
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        // Remove the deleted place from filteredPlaces
        setFilteredPlaces(prevPlaces => prevPlaces.filter(place => place.id !== placeId));
        console.log(`Place ${placeId} removed from favorites`);
        alert("Place removed from favorites!");
      })
      .catch(error => {
        setError(`Error removing place: ${error.message}`);
        console.error('Fetch error:', error);
      });
  };

  return (
    <div className="container">
      <header>
        <h1>Mood Mapr</h1>
      </header>
      
      <section>
        <h2>Search By City</h2>
        <SearchBar />
        <MoodContainer moods={moods} onMoodSelect={handleMoodSelect} />
      </section>
      
      {fetching ? (
        <p>Loading places...</p>
      ) : (
        <section>
          <h2>Browse Places</h2>
          <ul className="cards">
            {filteredPlaces.length === 0 ? (
              <li>No places found.</li>
            ) : (
              filteredPlaces.map(place => (
                <li key={place.id}>
                  <PlaceCard 
                    place={place} 
                    onSave={handleSave} 
                    onDelete={handleDelete} 
                  />
                  <Link to={`/places/${place.id}`}>View Details</Link>
                </li>
              ))
            )}
          </ul>
        </section>
      )}
      
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;
