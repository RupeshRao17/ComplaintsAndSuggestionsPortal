import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterComplaint.css';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(auth.currentUser ? auth.currentUser.email : '');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreement) {
      alert("Please agree to the privacy policy.");
      return;
    }

    setLoading(true);

    try {
      // Add complaint to Firestore
      await addDoc(collection(db, 'complaints'), {
        userId: auth.currentUser.uid,
        fullName,
        email,
        phone,
        role,
        department,
        complaintTitle,
        description,
        category,
        status: 'Pending',
        createdAt: new Date(),
      });

      alert("Complaint registered successfully!");
      navigate('/dashboard'); // Redirect to dashboard after submission
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("There was an issue submitting your complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-complaint-container">
      <h2>Register a Complaint</h2>
      <form onSubmit={handleSubmit} className="complaint-form">
        <fieldset>
          <legend>Personal Information</legend>
          <label>
            Full Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              disabled
            />
          </label>
          <label>
            Phone No:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <label>
            Role/Profession:
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </label>
          <label>
            Department Name:
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </label>
        </fieldset>
        
        <fieldset>
          <legend>Complaint Details</legend>
          <label>
            Complaint Title:
            <input
              type="text"
              value={complaintTitle}
              onChange={(e) => setComplaintTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description of Complaint:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a Category</option>
              <option value="IT Support">IT Support</option>
              <option value="Facilities">Facilities</option>
              <option value="Academics">Academics</option>
            </select>
          </label>
        </fieldset>

        <label>
          <input
            type="checkbox"
            checked={agreement}
            onChange={() => setAgreement(!agreement)}
          />
          I agree to the privacy policy.
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default RegisterComplaint;
