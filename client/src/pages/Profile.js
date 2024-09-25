import React, { useState, useEffect } from 'react';

function Profile() {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [userId, setUserId] = useState(1); 

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
    setSuccess('');

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
        setSuccess('User created successfully!');
        setNewUser({
          username: '',
          email: '',
          password: '',
        });
      })
      .catch(error => {
        setError(`Error adding user: ${error.message || 'Unknown error'}`);
      })
      .finally(() => {
        setUserLoading(false);
      });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5555/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setNewUser({
          username: data.username,
          email: data.email,
          password: '', 
        });
      } catch (error) {
        setError(`Error fetching user: ${error.message}`);
      }
    };

    fetchUser();
  }, [userId]);

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
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Profile;
