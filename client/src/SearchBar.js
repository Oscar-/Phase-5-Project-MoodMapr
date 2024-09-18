import React, { useState } from 'react';

function SearchBar() {
    const [city, setCity] = useState('');  // Holds the city input from the user
    const [places, setPlaces] = useState([]);  // Holds the filtered places based on city
    const [error, setError] = useState('');  // Holds error messages

    const handleSearch = (e) => {
        e.preventDefault();

        // Fetch places based on city input
        fetch(`http://127.0.0.1:5000/places/city?city=${city}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No places found for this city.');
                }
                return response.json();
            })
            .then((data) => {
                setPlaces(data);  // Store the filtered places in state
                setError('');  // Clear any previous errors
            })
            .catch((error) => {
                setError(error.message);  // Display error message
                setPlaces([]);  // Clear the places in case of an error
            });
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by city"
                    value={city}  // Bind the input value to the city state
                    onChange={(e) => setCity(e.target.value)}  // Update state when user types
                />
                <button type="submit">Search</button>
            </form>

            <div>
                <h3>Places in {city}</h3>
                {error && <p>{error}</p>}  {/* Show error message if any */}
                <ul>
                    {places.length === 0 && !error ? (
                        <li>No places found for this city.</li>
                    ) : (
                        places.map((place, index) => (
                            <li key={index}>
                                <h4>{place.name}</h4>
                                <p>{place.description}</p>
                                {place.image && <img src={place.image} alt={place.name} />}
                                <a href={place.link}>Visit</a>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default SearchBar;
