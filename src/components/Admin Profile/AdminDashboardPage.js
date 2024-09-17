import React from 'react';
import {Link} from "react-router-dom";

const DashboardPage = () => {
    return (
        <div className="admin-container">
            {/* Sidebar */}


            {/* Main Content */}
            <main className="main-content">
                <h1>Welcome to the Admin Dashboard</h1>
                {/*<p>Here you can manage all aspects of the platform, including appointments, clients, and mesters. Use the sidebar to navigate through the different sections.</p>*/}

                <section className="overview">
                    <h2>Overview</h2>
                    <div className="overview-card">
                        <h3>Recent Appointments</h3>
                        <p>View and manage recent appointments scheduled through the platform.</p>
                        <Link to="/admin/dashboard/appointment">Appointments</Link>
                    </div>
                    <div className="overview-card">
                        <h3>Client Activity</h3>
                        <p>Check the latest activity and updates from clients.</p>
                        <Link to="/admin/dashboard/client">Client List</Link>
                    </div>
                    <div className="overview-card">
                        <h3>Mester Activity</h3>
                        <p>Check the latest activity and updates from mesters.</p>
                        <Link to="/admin/dashboard/mester">Mester List</Link>
                    </div>
                </section>

                <section className="quick-links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/dashboard/appointment">Appointments</Link></li>
                        <li><Link to="/admin/dashboard/client">Client List</Link></li>
                        <li><Link to="/admin/dashboard/mester">Mester List</Link></li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
