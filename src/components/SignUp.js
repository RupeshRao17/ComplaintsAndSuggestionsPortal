import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';  // Adjust the path if needed
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Check if the email is in the authorizedAdmins collection
      const adminDoc = await getDoc(doc(db, 'authorizedAdmins', email));
  
      // Set role based on whether the email is in the authorizedAdmins collection
      const role = adminDoc.exists() ? 'admin' : 'student';
  
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save the user's role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role
      });
  
      // Navigate to the appropriate dashboard based on the role
      navigate(role === 'student' ? '/dashboard' : '/admin', {
        state: {
          userName: email,
          role: role === 'student' ? 'Student' : 'Admin'
        }
      });
    } catch (error) {
      alert(`Sign-Up failed: ${error.message}`);
    }
  };

  return (
    <div className="sign-up">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
