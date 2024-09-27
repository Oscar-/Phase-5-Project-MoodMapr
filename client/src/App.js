import React from 'react';
import { Route, Routes, NavLink } from 'react-router-dom'; 
import Home from './pages/Home';
import NewPlaceForm from './pages/NewPlaceForm';
import Trip from './pages/Trip';
import Map from './pages/Map';
import PlaceDetail from './components/Place/PlaceDetail';
import FavoriteContainer from './components/Favorite/FavoriteContainer'; 

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
          <li><NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>Favorites</NavLink></li>
          <li><NavLink to="/trips" className={({ isActive }) => (isActive ? 'active' : '')}>Trips</NavLink></li>
          <li><NavLink to="/maps" className={({ isActive }) => (isActive ? 'active' : '')}>Map</NavLink></li>
          <li><NavLink to="/placeform" className={({ isActive }) => (isActive ? 'active' : '')}>Add Place</NavLink></li>

        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/placeform" element={<NewPlaceForm />} />
        <Route path="/trips" element={<Trip />} />
        <Route path="/places/:id" element={<PlaceDetail />} />
        <Route path="/favorites" element={<FavoriteContainer />} /> 
        <Route path="/maps" element={<Map />} /> 
      </Routes>
    </div>
  );
}

export default App;
