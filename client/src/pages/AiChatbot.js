import React, { useState } from 'react';

function AiChatbot() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAiPromptChange = (e) => {
    setAiPrompt(e.target.value);
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    setAiLoading(true);
    setError('');

    fetch('http://localhost:5555/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ prompt: aiPrompt }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then(data => {
        setAiResponse(data.text);
      })
      .catch(error => {
        setError(`Error fetching AI text: ${error.message}`);
        console.error('AI request error:', error);
      })
      .finally(() => {
        setAiLoading(false);
      });
  };

  return (
    <div>
      <h2>AI Chatbot</h2>
      <form onSubmit={handleAiSubmit}>
        <div>
          <label>
            Prompt:
            <input
              type="text"
              value={aiPrompt}
              onChange={handleAiPromptChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={aiLoading}>
          {aiLoading ? 'Generating...' : 'Generate Text'}
        </button>
      </form>
      {aiResponse && (
        <div>
          <h3>AI Response:</h3>
          <p>{aiResponse}</p>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default AiChatbot;
