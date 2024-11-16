import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SignUp from './components/SignUp';
import RegisterComplaint from './components/RegisterComplaint';
import MakeSuggestion from './components/SubmitSuggestion';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up a listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Update user state when login or signup occurs
    });

    return () => unsubscribe();  // Clean up the listener on component unmount
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register-complaint" element={<RegisterComplaint/>} />
        <Route path="/make-suggestion" element={<MakeSuggestion/>} />
      </Routes>
    </Router>
  );
}

export default App;
