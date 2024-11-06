import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true); // State to handle loading
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  

  useEffect(() => {
    // Check if the current user is an admin by checking the 'authorizedAdmins' collection
    const checkIfAdmin = async () => {
      if (auth.currentUser) {
        const email = auth.currentUser.email;
        const adminRef = doc(db, 'authorizedAdmins', email);
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists()) {
          setIsAdmin(true); // User is an admin
        } else {
          setIsAdmin(false); // User is not an admin, redirect to normal dashboard
         
        }
      }
    };

    // Get current user's information and complaints
    const fetchStudentData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setStudentName(userData.name); // Set student name from Firestore
            setDepartment(userData.department); // Set department from Firestore
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };

    const fetchComplaints = async () => {
      if (auth.currentUser) {
        try {
          const complaintsRef = collection(db, 'complaints');
          const complaintsQuery = query(
            complaintsRef,
            where("userId", "==", auth.currentUser.uid),
            where("status", "!=", "Resolved")
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
          setLoading(false); // Stop loading once data is fetched
        }
      }
    };

    checkIfAdmin(); // Check if the user is an admin
    fetchStudentData(); // Fetch student data
    fetchComplaints(); // Fetch complaints

  }, ); // Run when the component mounts

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
            {isAdmin && <a href="#admin" className="nav-link">Admin Panel</a>} {/* Only show admin link if the user is an admin */}
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
                {loading ? (
                  <p>Loading...</p> // Show loading message until data is fetched
                ) : complaints.length > 0 ? (
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
                  <p>No active complaints found.</p> // Show this message if no complaints found
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
