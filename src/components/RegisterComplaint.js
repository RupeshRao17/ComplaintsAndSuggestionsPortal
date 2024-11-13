import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterComplaint.css';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import collegeLogo from './logo_campus.png'; // Logo path
import Modal from './Modal'; // Import the Modal component


//check

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Fetch user email with an auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
      }
      setIsUserLoaded(true); // Set to true after user state is determined
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreement) {
      setModalMessage("Please agree to the privacy policy.");
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
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
      setModalMessage("Complaint registered successfully!");
      setShowModal(true);
      setTimeout(() => navigate('/dashboard'), 1500); // Redirect after 1.5 seconds
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setModalMessage("There was an issue submitting your complaint.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!isUserLoaded) {
    // Render loading spinner or message until user data is ready
    return <div>Loading...</div>;
  }

  return (
    <div className="register-complaint-page">
      {/* Header */}
      <header className="header">
        <img src={collegeLogo} alt="College Logo" className="logo" />
        <h1>Bharati Vidyapeeth (Deemed to be University)</h1>
      </header>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/register-complaint" className="nav-link active">Make a Complaint</Link>
        <Link to="#track-complaint" className="nav-link">Track Your Complaint</Link>
        <Link to="#suggestions" className="nav-link">Give Suggestion</Link>
      </aside>

      {/* Main Content */}
      <main className="register-complaint-container">
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

          <label className="agreement-label">
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

        {/* Modal for Error/Success Messages */}
        {showModal && (
          <Modal message={modalMessage} onClose={closeModal} />
        )}
      </main>
    </div>
  );
};

export default RegisterComplaint;
