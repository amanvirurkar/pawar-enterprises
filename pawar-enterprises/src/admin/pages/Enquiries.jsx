import React from 'react';
import { Search, Mail, Phone, Calendar } from 'lucide-react';

const AdminEnquiries = () => {
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div className="header-text">
          <h1>Customer Enquiries</h1>
          <p>Manage and respond to product enquiries.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search by name, phone or product..." />
        </div>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Interested In</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy Data */}
              <tr>
                <td><strong>Aman Sharma</strong></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '13px' }}><Phone size={12} className="inline mr-1" /> +91 9876543210</span>
                  </div>
                </td>
                <td>Samsung 253L Refrigerator</td>
                <td>Oct 08, 2026</td>
                <td><span className="status-badge active" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>New</span></td>
                <td>
                  <button className="btn-secondary btn-sm">View Details</button>
                </td>
              </tr>
              <tr>
                <td><strong>Kunal</strong></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '13px' }}><Phone size={12} className="inline mr-1" /> +91 8765432109</span>
                  </div>
                </td>
                <td>Sony Bravia 55" TV</td>
                <td>Oct 07, 2026</td>
                <td><span className="status-badge active" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>Contacted</span></td>
                <td>
                  <button className="btn-secondary btn-sm">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
