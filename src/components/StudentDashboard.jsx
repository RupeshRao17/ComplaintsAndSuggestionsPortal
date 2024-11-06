import React, { useState } from 'react';
import './StudentDashboard.css';
import studentPic from './car.jpg'; // Path to student profile picture
import collegeLogo from './logo_campus.png'; // Path to college logo

const StudentDashboard = ({ 
  studentName = "Mayur Joshi", 
  department = "Computer Application"
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
                  <img 
                    src={studentPic} // Using the imported student profile pic here
                    alt="Profile" 
                    className="avatar"
                  />
                </div>
                <h2 className="profile-name">{studentName}</h2>
                <p className="profile-department">{department}</p>
              </div>
            </div>

            {/* Active Complaints Section */}
            <div className="complaints-section">
              <h3 className="section-title"><b>Active Complaints</b></h3>
              <div className="complaints-list">
                {/* Example complaint card */}
                <div className="complaint-card">
                  <div className="complaint-header">
                    <div className="complaint-info">
                      <h4 className="complaint-title">Maintenance Issue</h4>
                      <p className="complaint-id">Complaint ID: #12345</p>
                    </div>
                    <span className="status-badge">
                      In Progress
                    </span>
                  </div>
                  <p className="complaint-description">
                    Classroom projector needs maintenance in Room 302.
                  </p>
                </div>
                <div className="complaint-card">
                  <div className="complaint-header">
                    <div className="complaint-info">
                      <h4 className="complaint-title">Faculty issue</h4>
                      <p className="complaint-id">Complaint ID: #100100</p>
                    </div>
                    <span className="status-badge">
                      In Progress
                    </span>
                  </div>
                  <p className="complaint-description">
                    who tf appointent this IDBI guy as R pro faculty?!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
