import React, { useEffect, useState } from 'react';
import MapboxGL from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

MapboxGL.accessToken = 'pk.eyJ1IjoiaWFtb3NjYWJyZXJhIiwiYSI6ImNtMWd3d2tzaDA5b3cyanB5NDZvcnoyYjQifQ.1NFE93XF-nvIW8AdxHsP0Q'; // Replace with your Mapbox access token

const Map = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/places') // Fetching places 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setPlaces(data))
      .catch((error) => console.error('Error fetching places:', error));
  }, []);

  useEffect(() => {
    const map = new MapboxGL.Map({
      container: 'map', // ID of the element to contain the map
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [places.length > 0 ? places[0].lng : 0, places.length > 0 ? places[0].lat : 0], // Center map based on first place
      zoom: 10, // Initial zoom level
    });

    // Ensure map is fully loaded before adding markers
    map.on('load', () => {
      // Add markers for each place
      places.forEach((place) => {
        const marker = new MapboxGL.Marker()
          .setLngLat([place.lng, place.lat]) // Set marker position using place coordinates
          .addTo(map); // Add marker to the map

        // Create a popup for each marker with a clickable link and image
        const popupContent = `
          <div style="width: 200px;">
            <img src="${place.image}" alt="${place.name}" style="width: 100%; height: auto;" />
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <a href="${place.link}" target="_blank" rel="noopener noreferrer">View Details</a>
          </div>
        `;

        marker.setPopup(new MapboxGL.Popup().setHTML(popupContent)); // Set the HTML content for the popup
      });
    });

    return () => {
      map.remove(); 
    };
  }, [places]); 

  return <div id="map" style={{ height: '100vh', width: '100%' }} />; // Map container
};

export default Map;

