import React from 'react';

function MoodContainer({ moods, onMoodSelect }) {
  return (
    <div>
      <h2>Select a Mood</h2>
      <ul className="mood-list"> 
        {moods.map(mood => (
          <li key={mood.id} className="mood-item"> 
            <button 
              onClick={() => onMoodSelect(mood.feeling_name)} 
              className="mood-button" 
            >
              {mood.feeling_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodContainer;
