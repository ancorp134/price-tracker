import React from "react";
import { useAuth } from "../Context/AuthContext"; // adjust path

import "../assets/css/dashboard.css";

const Dashboard = () => {
  const { user, logout, trackedProducts } = useAuth();

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="dashboard-container">
  {/* Sidebar */}
  <div className="dashboard-sidebar">
    <h2 className="dashboard-nav-title">My Account</h2>
    <ul className="dashboard-nav-list">
      <li className="dashboard-nav-item">Profile</li>
      <li className="dashboard-nav-item">Tracked Products</li>
      <li className="dashboard-nav-item" onClick={logout}>Logout</li>
    </ul>
  </div>

  {/* Main Content */}
  <div className="dashboard-content">
    
    {/* Profile Section */}
    <div className="dashboard-section">
      <h1>Welcome, {user.first_name} {user.last_name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Joined:</strong> {user.joined || "N/A"}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>

    {/* Tracked Products Section */}
    <div className="dashboard-section">
      <h2>Tracked Products</h2>
      <div className="product-grid">
        {trackedProducts.map((product, index) => (
          <div key={index} className="product-card">
            <p><strong>Title:</strong> {product.product_title}</p>
            <p><strong>Current Price:</strong> ₹{product.current_price}</p>
            <p><strong>Target Price:</strong> ₹{product.target_price}</p>
            <p><strong>URL:</strong> <a className="product-link" href={product.product_url} target="_blank" rel="noopener noreferrer">View</a></p>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>
  );
};

export default Dashboard;
