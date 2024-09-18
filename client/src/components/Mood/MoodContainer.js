import React from 'react';

function MoodContainer({ moods, onMoodSelect }) {
  return (
    <div>
      <h2>Select a Mood</h2>
      <ul>
        {moods.map(mood => (
          <li key={mood.id}>
            <button onClick={() => onMoodSelect(mood.feeling_name)}>
              {mood.feeling_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodContainer;
