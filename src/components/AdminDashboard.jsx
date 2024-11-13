import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import collegeLogo from './logo_campus.png';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const location = useLocation();
  const { adminName, role } = location.state || {};

  const [complaints, setComplaints] = useState([
    {
      title: "Network Issue",
      description: "Wi-Fi not working in Lab 3",
      role: "Faculty",
      userName: "John Doe",
      category: "Infrastructure",
      priority: "High",
      status: "Resolved"
    },
    {
      title: "Maintenance",
      description: "Classroom projector needs maintenance in Room 302.",
      role: "Student",
      userName: "Mayur Joshi",
      category: "Infrastructure",
      priority: "Medium",
      status: "Unresolved"
    },
    // Additional sample complaints can go here
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    role: 'all',
    priority: 'all'
  });

  const resetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      role: 'all',
      priority: 'all'
    });
  };

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = filters.status === 'all' || complaint.status.toLowerCase() === filters.status;
    const categoryMatch = filters.category === 'all' || complaint.category.toLowerCase() === filters.category;
    const roleMatch = filters.role === 'all' || complaint.role.toLowerCase() === filters.role;
    const priorityMatch = filters.priority === 'all' || complaint.priority.toLowerCase() === filters.priority;
    return statusMatch && categoryMatch && roleMatch && priorityMatch;
  });

  // Prepare data for pie charts
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const unresolvedComplaints = complaints.filter(c => c.status === 'Unresolved').length;

  const complaintsByRole = complaints.reduce((acc, complaint) => {
    if (complaint.role === 'Student') acc.student++;
    if (complaint.role === 'Faculty') acc.faculty++;
    return acc;
  }, { student: 0, faculty: 0 });

  const unresolvedComplaintsByRole = complaints
    .filter(complaint => complaint.status === 'Unresolved')
    .reduce((acc, complaint) => {
      if (complaint.role === 'Student') acc.student++;
      if (complaint.role === 'Faculty') acc.faculty++;
      return acc;
    }, { student: 0, faculty: 0 });
  
  const statusData = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [
      {
        data: [resolvedComplaints, unresolvedComplaints],
        backgroundColor: ['#059669', '#dc2626'],
      },
    ],
  };

  const unresolvedRoleData = {
    labels: ['Student', 'Faculty'],
    datasets: [
      {
        data: [unresolvedComplaintsByRole.student, unresolvedComplaintsByRole.faculty],
        backgroundColor: ['#2563eb', '#fbbf24'],
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <img src={collegeLogo} alt="College Logo" className="logo" />
        <h1>Bharati Vidyapeeth (Deemed to be University)</h1>
      </header>

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          {adminName && <p>Welcome, {adminName} - {role}</p>}
        </div>

        <section className="info-cards">
          <div className="info-card">
            <h3>Total Complaints</h3>
            <div className="number">{complaints.length}</div>
          </div>
          <div className="info-card">
            <h3>Resolved</h3>
            <div className="number" style={{ color: '#059669' }}>
              {resolvedComplaints}
            </div>
          </div>
          <div className="info-card">
            <h3>Pending</h3>
            <div className="number" style={{ color: '#dc2626' }}>
              {unresolvedComplaints}
            </div>
          </div>
        </section>

        <div className="right-section">
          <div className="card small-card">
            <h2>Filters</h2>
            <div className="filters-section">
              <div className="filter-group">
                <label>Status</label>
                <select 
                  className="dropdown"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Category</label>
                <select 
                  className="dropdown"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Role</label>
                <select 
                  className="dropdown"
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Priority</label>
                <select 
                  className="dropdown"
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="reset-container">
              <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
            </div>
          </div>

          <div className="card small-card">
            <h2>Reports & Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card pie-card">
                <h3>Resolved vs Unresolved</h3>
                <div className="chart-container">
                  <Pie data={statusData} options={options} />
                </div>
                <div className="legend-container">
                  <span style={{ color: '#059669' }}>Resolved</span>
                  <span style={{ color: '#dc2626' }}>Unresolved</span>
                </div>
              </div>

              <div className="analytics-card pie-card">
                <h3>Unresolved Complaints by Role</h3>
                <div className="chart-container">
                  <Pie data={unresolvedRoleData} options={options} />
                </div>
                <div className="legend-container">
                  <span style={{ color: '#2563eb' }}>Student</span>
                  <span style={{ color: '#fbbf24' }}>Faculty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="complaints-section">
          <h2 className="section-title">Complaints</h2>
          <table className="complaints-table">
            <tbody>
              {filteredComplaints.map((complaint, index) => (
                <tr key={index}>
                  <td>
                    <div className="complaint-card">
                      <div className="complaint-header">
                        <div className="complaint-title">{complaint.title}</div>
                        <div
                          className={`status-badge ${
                            complaint.status.toLowerCase() === 'resolved' ? 'status-resolved' : 'status-unresolved'
                          }`}
                        >
                          {complaint.status}
                        </div>
                      </div>
                      <div className="complaint-description">{complaint.description}</div>
                      <div className="complaint-footer">
                        <div>
                          <span className="complaint-role">{complaint.role}</span> - {complaint.userName}
                        </div>
                        <div className={`complaint-priority priority-${complaint.priority.toLowerCase()}`}>
                          {complaint.priority}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
