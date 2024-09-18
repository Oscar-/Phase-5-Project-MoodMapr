import React, { useState } from 'react';

function Profile() {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        // Handle success (e.g., redirect or show a success message)
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

  return (
    <div>
      <h2>Profile - Register</h2>
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
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Profile;
