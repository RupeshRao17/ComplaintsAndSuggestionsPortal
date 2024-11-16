import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import './StudentDashboard.css';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import studentPic from './user-profile.jpg'; // Path to student profile picture
import collegeLogo from './logo_campus.png'; // Path to college logo

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [roleOfUser, setRoleUser] = useState('');
  const [emailId, setEmailID] = useState('');
  const [department, setDepartment] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is an admin
    const checkIfAdmin = async () => {
      if (auth.currentUser) {
        const email = auth.currentUser.email;
        const adminRef = doc(db, 'authorizedAdmins', email);
        const adminDoc = await getDoc(adminRef);
        setIsAdmin(adminDoc.exists());
      }
    };

    // Fetch student profile data
    const fetchStudentData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setStudentName(userData.name);
            setDepartment(userData.department);
            setContactNumber(userData.contactNumber);
            setRoleUser(userData.userType);
            setEmailID(userData.email);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };

    // Fetch complaints for the current user
    const fetchComplaints = async () => {
      if (auth.currentUser) {
        try {
          const complaintsRef = collection(db, 'complaints');
          const complaintsQuery = query(
            complaintsRef,
            where("userId", "==", auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(complaintsQuery);
          const complaintsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComplaints(complaintsData);
        } catch (error) {
          console.error("Error fetching complaints:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkIfAdmin();
    fetchStudentData();
    fetchComplaints();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <img src={collegeLogo} alt="College Logo" className="logo" />
        <h1>Bharati Vidyapeeth (Deemed to be University)</h1>
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/register-complaint" className="nav-link">Make a Complaint</Link>
            <Link to="/make-suggestion" className="nav-link">Give Suggestion</Link>
            {isAdmin && <Link to="/admin" className="nav-link">Admin Panel</Link>}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-container">
            {/* Profile Section */}
            <div className="profile-section">
              <div className="profile-content">
                <div className="profile-image">
                  <img src={studentPic} alt="Profile" className="avatar" />
                </div>
                <h2 className="profile-name">{studentName}</h2>
                <p className="profile-contact">{contactNumber}</p>
                <p className="profile-email">{emailId}</p>
                <p className="profile-role">{roleOfUser}</p>
                <p className="profile-department">{department}</p>
              </div>
            </div>

            {/* Active Complaints Section */}
            <div className="complaints-section">
              <h3 className="section-title"><b>Active Complaints</b></h3>
              <div className="complaints-list">
                {loading ? (
                  <p>Loading...</p> // Show loading message until data is fetched
                ) : complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <div key={complaint.id} className="complaint-card">
                      <div className="complaint-header">
                        <div className="complaint-info">
                          <h4 className="complaint-title">{complaint.complaintTitle}</h4>
                          <p className="complaint-id">Complaint ID: #{complaint.id}</p>
                        </div>
                        <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                          {complaint.status}
                        </span>
                      </div>
                      <p className="complaint-description">
                        {complaint.description}
                      </p>
                      <div className="complaint-footer">
                        <p><strong>Category:</strong> {complaint.category}</p>
                        <p><strong>Submitted On:</strong> {new Date(complaint.createdAt.seconds * 1000).toLocaleDateString()}</p>
                        <p><strong>Priority:</strong> {complaint.priority}</p>
                        <div className="feedback-section">
                          <h4>Feedback:</h4>
                          {complaint.feedback && complaint.feedback.length > 0 ? (
                            complaint.feedback.map((feedback, index) => (
                              <div key={index} className="feedback-item">
                                <p><strong>{feedback.adminName}:</strong> {feedback.feedback}</p>
                                <p><small>{new Date(feedback.timestamp).toLocaleString()}</small></p>
                              </div>
                            ))
                          ) : (
                            <p>No feedback yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No active complaints found.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
