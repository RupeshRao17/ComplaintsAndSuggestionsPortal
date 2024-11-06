import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';  // Adjust the path if needed
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [userType, setUserType] = useState('Student');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Determine role based on userType selection
      const role = "user" // Set role as 'student', 'faculty', or 'other'

      // Save the user's details in the 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name,
        contactNumber,
        department,
        userType: userType,
        role: role
      });

      // Redirect to login page after successful sign-up
      navigate('/');
    } catch (error) {
      console.error("Sign-up error:", error);  // Log error to console
      alert(`Sign-Up failed: ${error.message}`);
    }
  };

  return (
    <div className="sign-up">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        <label>Contact Number</label>
        <input 
          type="text" 
          value={contactNumber} 
          onChange={(e) => setContactNumber(e.target.value)} 
          required 
        />

        <label>Department</label>
        <input 
          type="text" 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)} 
          required 
        />

        <label>User Type</label>
        <select 
          value={userType} 
          onChange={(e) => setUserType(e.target.value)} 
          required
        >
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Other">Other</option>
        </select>

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
