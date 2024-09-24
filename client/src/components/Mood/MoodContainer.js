import React from 'react';

function MoodContainer({ moods, onMoodSelect }) {
  return (
    <div>
      <h2>Select a Mood</h2>
      <ul className="mood-list"> {/* Add class to ul */}
        {moods.map(mood => (
          <li key={mood.id} className="mood-item"> {/* Add class to li */}
            <button 
              onClick={() => onMoodSelect(mood.feeling_name)} 
              className="mood-button" /* Add class to button */
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
