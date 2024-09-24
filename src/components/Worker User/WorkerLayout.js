import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./WorkerLayout.css"

const WorkerLayout = () => {
    return (
        <div className="worker-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Worker Menu</h2>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/worker/profile">Edit Profile</Link></li>
                        <li><Link to="/worker/profile/orders">Orders</Link></li>
                        <li><Link to="/worker/profile/reviews">Reviews</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
};

export default WorkerLayout;
