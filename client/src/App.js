import React from 'react';
import { Route, Routes, NavLink } from 'react-router-dom'; // Use NavLink for active link styling
import SearchBar from './SearchBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AiChatbot from './pages/AiChatbot';
import PlaceDetail from './components/Place/PlaceDetail';
import FavoriteContainer from './components/Favorite/FavoriteContainer'; // Correct import for FavoritesContainer

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
          <li><NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>Favorites</NavLink></li>
          <li><NavLink to="/ai-chatbot" className={({ isActive }) => (isActive ? 'active' : '')}>Trips</NavLink></li>
          <li><NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-chatbot" element={<AiChatbot />} />
        <Route path="/places/:id" element={<PlaceDetail />} />
        <Route path="/favorites" element={<FavoriteContainer />} /> 
      </Routes>
    </div>
  );
}

export default App;
