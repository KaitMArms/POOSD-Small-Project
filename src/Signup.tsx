import { useState } from 'react'
import './App.css'

interface SignupResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    console.log('Signup attempt started');
    
    // Input validation
    if (!firstName || !lastName || !username || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    setMessage('');
    setIsLoading(true);

    try {
      console.log('Sending request to:', 'https://luisalban.xyz/LAMPAPI/Register.php');
      console.log('Request data:', { firstName, lastName, login: username, password });
      
      const response = await fetch('https://luisalban.xyz/LAMPAPI/Register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          firstName: firstName,
          lastName: lastName,
          login: username, 
          password: password
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const text = await response.text();
      console.log('Raw response from server:', text);
      
      let data: SignupResponse;
      try {
        data = text ? JSON.parse(text) : { id: 0, firstName: '', lastName: '', error: 'Invalid response' };
      } catch (e) {
        console.error('Parse error:', text);
        console.error('Parse error details:', e);
        throw new Error('Invalid JSON response: ' + text.substring(0, 100));
      }

      console.log('Parsed response data:', data);

      if (data.error === '') {
        // Signup successful - store userId and redirect
        localStorage.setItem('userId', data.id.toString());
        localStorage.setItem('userName', data.firstName);
        setMessage('Welcome, redirecting to contacts');
        setTimeout(() => {
          window.location.href = '/contacts';
        }, 2000);
      } else {
        // Signup failed
        setMessage('Registration failed. ' + (data.error || ''));
      }
    } catch (err) {
      console.error('Error details:', err);
      setMessage('Server error. Please try again. Details: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = '/';
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <h5>Enter your information:</h5>
      
      <input 
        type="text" 
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={isLoading}
      />
      
      <input 
        type="text" 
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={isLoading}
      />
      
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
      
      <button onClick={handleSignUp} disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
      
      {message && <div className="signup-message">{message}</div>}
      
      <header><strong>Already have an account?</strong></header>
      <button onClick={handleSignIn} disabled={isLoading}>Sign In</button>
    </div>
  )
}

export default Signup
