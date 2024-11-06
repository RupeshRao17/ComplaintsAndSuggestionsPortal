import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './App.css';
import collegeLogo from './logo_campus.png';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SignUp from './components/SignUp';

// Login component
function Login() {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (isStudent) {
        navigate('/dashboard', {
          state: {
            studentName: user.email,
            department: "Computer Engineering"
          }
        });
      } else {
        navigate('/admin', {
          state: {
            adminName: user.email,
            role: "Administrator"
          }
        });
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <img src={collegeLogo} alt="College Logo" className="logo" />
        <h1>Bharati Vidyapeeth (Deemed to be university)</h1>
      </header>
      <div className="login-section">
        <h2>Login Portal</h2>
        <div className="tab-buttons">
          <button 
            className={isStudent ? "active-tab" : ""}
            onClick={() => setIsStudent(true)}
          >
            Student
          </button>
          <button 
            className={!isStudent ? "active-tab" : ""}
            onClick={() => setIsStudent(false)}
          >
            Admin
          </button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>{isStudent ? "Email" : "Admin ID"}</label>
          <input 
            type="text" 
            placeholder={isStudent ? "Enter your Email ID" : "Enter your admin ID"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">{isStudent ? "Login as Student" : "Login as Admin"}</button>
        </form>
        
        <div className="sign-up-link">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
