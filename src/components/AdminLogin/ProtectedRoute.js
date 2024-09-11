import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider'; 

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    
    // Check if the user is authenticated
    if (!auth?.accessToken) {
        // If not authenticated, redirect to login
        return <Navigate to="/loginadmin" replace />;
    }
    
    // If authenticated, render the the protected component)
    return children;
};

export default ProtectedRoute;