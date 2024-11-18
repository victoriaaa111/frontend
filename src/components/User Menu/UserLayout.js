
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./UserLayout.css"

const UserLayout = () => {
    return (
        <div className="worker-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>User Menu</h2>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/client/profile">Profile</Link></li>
                        <li><Link to="/client/orders">Orders</Link></li>
                        <li><Link to="/client/favorites">Favorites</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <Outlet /> 
            </main>
        </div>
    );
};

export default UserLayout;
