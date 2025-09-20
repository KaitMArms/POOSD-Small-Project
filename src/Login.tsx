import { useState } from 'react'
import './App.css'
import { API_URL } from './config/api';

interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log('Login attempt started');
    
    // Input validation
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setErrorMessage('');
    setLoginMessage('');
    setIsLoading(true);

    try {
      console.log('Sending request to:', `${API_URL}/Login.php`);
      console.log('Request data:', { login: username, password: password });
      
      const response = await fetch(`${API_URL}/Login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          login: username, 
          password: password 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: LoginResponse = await response.json();

      console.log('Parsed response data:', data);

      if (data.error === '') {
        // Login successful - store userId and redirect
        localStorage.setItem('userId', data.id.toString());
        localStorage.setItem('userName', data.firstName);
        setLoginMessage(`Welcome ${data.firstName}, redirecting to contacts`);
        setTimeout(() => {
          window.location.href = '/contacts';
        }, 2000);
      } else {
        // Login failed
        setErrorMessage('Incorrect username or password. ' + (data.error || ''));
      }
    } catch (err) {
      console.error('Error details:', err);
      setErrorMessage('Server error. Please try again. Details: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="login-container">
      <h2>Welcome to Team's 2 Contact Manager <br /> Please Login</h2>
      
      <input 
        type="text" 
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />
      
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      
      {loginMessage && <div className="login-message">{loginMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <header><strong>Don't have an account?</strong></header>
      <button onClick={handleSignUp} disabled={isLoading}>Sign Up</button>
    </div>
  )
}

export default Login
