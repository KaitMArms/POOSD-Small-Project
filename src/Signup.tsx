import { useState } from "react";
import "./App.css";

interface SignupResponse {
  id: number;
  firstName: string;
  lastName: string;
  error: string;
}

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    console.log("Signup attempt started");

    // Input validation
    if (!firstName || !lastName || !username || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setMessage("");
    setIsLoading(true);

    try {
      console.log(
        "Sending request to:",
        "https://luisalban.xyz/LAMPAPI/Register.php"
      );
      console.log("Request data:", {
        firstName,
        lastName,
        login: username,
        password,
      });

      const response = await fetch(
        "https://luisalban.xyz/LAMPAPI/Register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            login: username,
            password: password,
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const text = await response.text();
      console.log("Raw response from server:", text);

      let data: SignupResponse;
      try {
        data = text
          ? JSON.parse(text)
          : { id: 0, firstName: "", lastName: "", error: "Invalid response" };
      } catch (e) {
        console.error("Parse error:", text);
        console.error("Parse error details:", e);
        throw new Error("Invalid JSON response: " + text.substring(0, 100));
      }

      console.log("Parsed response data:", data);

      if (data.error === "") {
        // Signup successful - store userId and redirect
        localStorage.setItem("userId", data.id.toString());
        localStorage.setItem("userName", data.firstName);
        setMessage("Welcome, redirecting to contacts");
        setTimeout(() => {
          window.location.href = "/contacts";
        }, 2000);
      } else {
        // Signup failed
        setMessage("Registration failed. " + (data.error || ""));
      }
    } catch (err) {
      console.error("Error details:", err);
      setMessage(
        "Server error. Please try again. Details: " + (err as Error).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = "/";
  };

  return (
    <div className="signup-page">
      <div className="signup-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="signup-container">
        <div className="signup-header">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="8.5"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 8V14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 11H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="signup-title">Join Contact Manager</h1>
          <p className="signup-subtitle">Create your account to get started</p>
        </div>

        <div className="signup-form">
          <div className="input-group">
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                className="signup-input"
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
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                className="signup-input"
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
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="signup-input"
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
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="signup-input"
              />
            </div>
          </div>

          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className={`signup-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <span className="loading-content">
                <div className="spinner"></div>
                Creating account...
              </span>
            ) : (
              <span>
                Create Account
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

          {message && (
            <div
              className={`message ${
                message.includes("Welcome")
                  ? "success-message"
                  : "error-message"
              }`}
            >
              <svg
                className="message-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {message.includes("Welcome") ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </svg>
              {message}
            </div>
          )}

          <div className="divider">
            <span>Already have an account?</span>
          </div>

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="signin-button"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
