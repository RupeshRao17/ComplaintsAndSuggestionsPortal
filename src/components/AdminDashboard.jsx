import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import collegeLogo from './logo_campus.png'; // Update path to your logo

const AdminDashboard = () => {
  const location = useLocation();
  const { adminName, role } = location.state || {};

  const [complaints, setComplaints] = useState([
    {
      title: "Network Issue",
      description: "Wi-Fi not working in Lab 3",
      role: "Technical",
      userName: "John Doe",
      category: "Infrastructure",
      priority: "High",
      status: "Resolved"
    },
    {
      title: "Maintenance",
      description: "Classroom projector needs maintenance in Room 302.",
      role: "Technical",
      userName: "Mayur Joshi",
      category: "Infrastructure",
      priority: "High",
      status: "Unresolved"
    },
    // Additional sample complaints can go here
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all'
  });

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = filters.status === 'all' || complaint.status.toLowerCase() === filters.status;
    const categoryMatch = filters.category === 'all' || complaint.category.toLowerCase() === filters.category;
    return statusMatch && categoryMatch;
  });

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
              {complaints.filter(c => c.status === 'Resolved').length}
            </div>
          </div>
          <div className="info-card">
            <h3>Pending</h3>
            <div className="number" style={{ color: '#dc2626' }}>
              {complaints.filter(c => c.status === 'Unresolved').length}
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
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">All</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card small-card">
            <h2>Reports & Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Resolved Complaints</h3>
                <div className="number" style={{ color: '#059669' }}>
                  {((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100).toFixed(0)}%
                </div>
              </div>
              <div className="analytics-card">
                <h3>Average Response Time</h3>
                <div className="number" style={{ color: '#2563eb' }}>24h</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Complaints</h2>
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Role</th>
                <th>User Name</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint, index) => (
                <tr key={index}>
                  <td>{complaint.title}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.role}</td>
                  <td>{complaint.userName}</td>
                  <td>{complaint.category}</td>
                  <td>
                    <span className={`priority-${complaint.priority.toLowerCase()}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${complaint.status.toLowerCase() === 'resolved' ? 'status-resolved' : 'status-unresolved'}`}>
                      {complaint.status}
                    </span>
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