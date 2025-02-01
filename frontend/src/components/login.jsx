// src/components/Login.js

import React, { useState } from 'react';
import { login } from '../services/api'; // Adjust the path according to your project structure

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      // Assuming the login function returns an object with 'access_token'
      localStorage.setItem('access_token', result.access_token);
      // Redirect to dashboard or another page after successful login
      window.location.href = '/dashboard'; 
    } catch (error) {
      // Handle login error by setting an error message
      setError(error.message || "Invalid credentials or server error");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;