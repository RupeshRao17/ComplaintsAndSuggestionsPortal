import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import studentPic from './user-profile.jpg'; // Path to student profile picture
import collegeLogo from './logo_campus.png'; // Path to college logo

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('');
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Get current user's information
    const fetchStudentData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStudentName(userData.name); // default if name not found
          setDepartment(userData.department); // default if department not found
        }
      }
    };

    // Fetch student's active complaints
    const fetchComplaints = async () => {
      if (auth.currentUser) {
        const complaintsRef = collection(db, 'complaints');
        const complaintsQuery = query(complaintsRef, where("userId", "==", auth.currentUser.uid), where("status", "!=", "Resolved"));
        const querySnapshot = await getDocs(complaintsQuery);

        const complaintsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComplaints(complaintsData);
      }
    };

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
            <a href="#dashboard" className="nav-link">Dashboard</a>
            <a href="#make-complaint" className="nav-link">Make a Complaint</a>
            <a href="#track-complaint" className="nav-link">Track Your Complaint</a>
            <a href="#suggestions" className="nav-link">Give Suggestion</a>
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
                <p className="profile-department">{department}</p>
              </div>
            </div>

            {/* Active Complaints Section */}
            <div className="complaints-section">
              <h3 className="section-title"><b>Active Complaints</b></h3>
              <div className="complaints-list">
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <div key={complaint.id} className="complaint-card">
                      <div className="complaint-header">
                        <div className="complaint-info">
                          <h4 className="complaint-title">{complaint.title}</h4>
                          <p className="complaint-id">Complaint ID: #{complaint.id}</p>
                        </div>
                        <span className="status-badge">
                          {complaint.status}
                        </span>
                      </div>
                      <p className="complaint-description">
                        {complaint.description}
                      </p>
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
