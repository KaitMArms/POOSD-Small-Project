import { useState } from "react";
import "./App.css";
import { API_URL } from "./config/api";

interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login attempt started");

    // Input validation
    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    setErrorMessage("");
    setLoginMessage("");
    setIsLoading(true);

    try {
      console.log("Sending request to:", `${API_URL}/Login.php`);
      console.log("Request data:", { login: username, password: password });

      const response = await fetch(`${API_URL}/Login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      console.log("Parsed response data:", data);

      if (data.error === "") {
        // Login successful - store userId and redirect
        localStorage.setItem("userId", data.id.toString());
        localStorage.setItem("userName", data.firstName);
        setLoginMessage(`Welcome ${data.firstName}, redirecting to contacts`);
        setTimeout(() => {
          window.location.href = "/contacts";
        }, 2000);
      } else {
        // Login failed
        setErrorMessage(
          "Incorrect username or password. " + (data.error || "")
        );
      }
    } catch (err) {
      console.error("Error details:", err);
      setErrorMessage(
        "Server error. Please try again. Details: " + (err as Error).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    window.location.href = "/signup";
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="login-title">Contact Manager</h1>
          <p className="login-subtitle">Team 2's Professional Contact Hub</p>
        </div>

        <div className="login-form">
          <div className="input-group">
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="login-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="login-input"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`login-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <span className="loading-content">
                <div className="spinner"></div>
                Signing in...
              </span>
            ) : (
              <span>
                Sign In
                <svg
                  className="button-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </button>

          {loginMessage && (
            <div className="message success-message">
              <svg
                className="message-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L11 14L15 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {loginMessage}
            </div>
          )}

          {errorMessage && (
            <div className="message error-message">
              <svg
                className="message-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="15"
                  y1="9"
                  x2="9"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="9"
                  y1="9"
                  x2="15"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {errorMessage}
            </div>
          )}

          <div className="divider">
            <span>New to Contact Manager?</span>
          </div>

          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="signup-button"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
