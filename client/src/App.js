import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fetch users from the server
  useEffect(() => {
    setFetching(true);
    fetch('http://localhost:5555/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        setError('Error fetching users');
        console.error('Fetch error:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission for new user
  const handleUserSubmit = (e) => {
    e.preventDefault();
    setUserLoading(true);
    setError('');

    fetch('http://localhost:5555/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(newUser),
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
        if (data.error) {
          throw new Error(data.error);
        }
        setUsers(prevUsers => [...prevUsers, data.user]);
        setNewUser({
          username: '',
          email: '',
          password: '',
        });
        setError('');
      })
      .catch(error => {
        setError(`Error adding user: ${error.message}`);
        console.error('Submit error:', error);
      })
      .finally(() => {
        setUserLoading(false);
      });
  };

  // Handle AI prompt change
  const handleAiPromptChange = (e) => {
    setAiPrompt(e.target.value);
  };

  // Handle AI request submission
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
    <div className="App">
      <h1>Users</h1>
      {error && <p>{error}</p>}
      {fetching ? <p>Loading users...</p> : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} - {user.email}
            </li>
          ))}
        </ul>
      )}
      <h2>Add New User</h2>
      <form onSubmit={handleUserSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={userLoading}>
          {userLoading ? 'Adding...' : 'Add User'}
        </button>
      </form>

      <h2>AI Text Generator</h2>
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
    </div>
  );
}

export default App;
