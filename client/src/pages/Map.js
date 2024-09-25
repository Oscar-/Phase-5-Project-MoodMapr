import React, { useEffect, useState } from 'react';
import MapboxGL from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

MapboxGL.accessToken = 'pk.eyJ1IjoiaWFtb3NjYWJyZXJhIiwiYSI6ImNtMWd3d2tzaDA5b3cyanB5NDZvcnoyYjQifQ.1NFE93XF-nvIW8AdxHsP0Q'; // Replace with your Mapbox access token

const MapComponent = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/api/locations') // Fetching from your Flask API
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    const map = new MapboxGL.Map({
      container: 'map', // ID of the element to contain the map
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [locations.length > 0 ? locations[0].lng : 0, locations.length > 0 ? locations[0].lat : 0], // Center map based on first location
      zoom: 10, // Initial zoom level
    });

    // Add markers for each location
    locations.forEach((location) => {
      new MapboxGL.Marker()
        .setLngLat([location.lng, location.lat]) // Set marker position
        .setPopup(new MapboxGL.Popup().setText(location.city_name)) // Add popup with city name
        .addTo(map); // Add marker to the map
    });

    return () => {
      map.remove(); // Cleanup on component unmount
    };
  }, [locations]); // Re-run effect when locations change

  return <div id="map" style={{ height: '100vh', width: '100%' }} />; // Map container
};

export default MapComponent;
