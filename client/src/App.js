import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AiChatbot from './pages/AiChatbot';
import PlaceDetail from './components/Place/PlaceDetail';

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/ai-chatbot">Trips</Link></li>
          <li><Link to="/places">Explore</Link></li> 
          <li><Link to="/places">Wishlist</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-chatbot" element={<AiChatbot />} />
        <Route path="/places/:id" element={<PlaceDetail />} /> 
      </Routes>
    </div>
  );
}

export default App;
