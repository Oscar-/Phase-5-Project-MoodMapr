import React, { useState } from 'react';

function SearchBar() {
    const [location, setLocation] = useState('');  // Holds the location input from the user
    const [places, setPlaces] = useState([]);  // Holds filtered places based on location
    const [error, setError] = useState('');  // Holds error messages
    const [fetching, setFetching] = useState(false);  // Loading state

    const handleSearch = (e) => {
        e.preventDefault();
        setFetching(true);

        fetch(`http://127.0.0.1:5555/places/by_location?city=${location}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPlaces(data);
                setError('');
            })
            .catch(error => {
                setError(`Error fetching places: ${error.message}`);
                console.error('Fetch error:', error);
            })
            .finally(() => {
                setFetching(false);
            });
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Search by city"
                    value={location}  // Bind the input value to the location state
                    onChange={(e) => setLocation(e.target.value)}  // Update state when user types
                />
                <button type="submit" disabled={fetching}>
                    {fetching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="search-results">
                <h3>Places in {location}</h3>
                <ul>
                    {places.length === 0 ? (
                        <li>No places found for this location.</li>
                    ) : (
                        places.map((place) => (
                            <li key={place.id}>
                                <h4>{place.name}</h4>
                                <p>{place.description}</p>
                                {place.image && <img src={place.image} alt={place.name} />}
                                <a href={place.link} target="_blank" rel="noopener noreferrer">Visit</a>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default SearchBar;
