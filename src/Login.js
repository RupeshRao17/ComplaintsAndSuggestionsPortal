import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import './App.css';
import collegeLogo from './logo_campus.png';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SignUp from './components/SignUp';
import Modal from './components/Modal'; // Import Modal

function Login() {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
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
        const adminDocRef = doc(db, 'authorizedAdmins', email);
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists() && adminDoc.data().role === 'admin') {
          navigate('/admin', {
            state: {
              adminName: user.email,
              role: "Administrator"
            }
          });
        } else {
          setModalMessage("Access denied: You do not have admin privileges.");
        }
      }
    } catch (error) {
      setModalMessage(`Login failed: ${error.message}`);
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

      {/* Render Modal if modalMessage is not empty */}
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage('')} />}
    </div>
  );
}

export default Login;
