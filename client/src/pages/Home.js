import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import SearchBar from '../SearchBar';
import MoodContainer from '../components/Mood/MoodContainer'; 
import PlaceCard from '../components/Place/PlaceCard'; // Import PlaceCard

function Home() {
  const [moods, setMoods] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]); // State for all places
  const [filteredPlaces, setFilteredPlaces] = useState([]); // State for places filtered by mood
  const [selectedMood, setSelectedMood] = useState(null);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);

  // Fetch moods from the server
  useEffect(() => {
    fetch('http://localhost:5555/moods')
      .then(response => response.json())
      .then(data => setMoods(data))
      .catch(error => {
        setError('Error fetching moods');
        console.error('Fetch error:', error);
      });
  }, []);

  // Fetch all places
  useEffect(() => {
    fetch('http://localhost:5555/places') // Endpoint for all places
      .then(response => response.json())
      .then(data => {
        setAllPlaces(data);
        setFilteredPlaces(data); // Initially, show all places
      })
      .catch(error => {
        setError('Error fetching places');
        console.error('Fetch error:', error);
      });
  }, []);

  // Fetch places based on the selected mood
  useEffect(() => {
    if (!selectedMood) {
      setFilteredPlaces(allPlaces); // Show all places if no mood is selected
      return;
    }

    setFetching(true);
    fetch(`http://localhost:5555/places/by_mood?mood=${encodeURIComponent(selectedMood)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Filtered places:', data); // Debug data
        setFilteredPlaces(data);
      })
      .catch(error => {
        setError('Error fetching places');
        console.error('Fetch error:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [selectedMood, allPlaces]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  return (
    <div className="container">
      <header>
        <h1>Explore Places</h1>
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
                  <PlaceCard place={place} /> {/* Use PlaceCard component */}
                  <Link to={`/places/${place.id}`}>View Details</Link> {/* Link to detailed view */}
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
