import React from 'react';
import { Outlet } from 'react-router-dom';
import './AdminAppointmentView.css';
import { Link } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin Menu</h2>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/dashboard/appointment">Appointments</Link></li>
                        <li><Link to="/admin/dashboard/client">Client List</Link></li>
                        <li><Link to="/admin/dashboard/mester">Mester List</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet /> {/* Aici vor fi încărcate componentele copil */}
            </main>
        </div>
    );
};

export default AdminLayout;
