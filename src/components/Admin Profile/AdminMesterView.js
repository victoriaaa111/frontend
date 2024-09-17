// AdminMester.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminAppointmentView.css';
import { Link } from "react-router-dom";

// URL-ul API-ului pentru a obține datele (înlocuiește cu URL-ul tău)
const API_URL = 'URL_CARE_SE_RASPUNDE_LA_CERERE';

const AdminMester = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Funcție pentru a aduce datele
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(API_URL);
                setAppointments(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Welcome to the 'See Appointments' Page</h1>
            {/* Afișează datele */}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Contact</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.fullName}</td>
                        <td>{appointment.contact}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Link către alte pagini dacă este necesar */}
            <Link to="/other-page">Go to Other Page</Link>
        </div>
    );
};

export default AdminMester;

// Utilizare funcție pentru actualizarea unui lucrător
const updateWorker = async (workerId, updateData) => {
    try {
        const response = await axios.patch(`worker/edit/${workerId}`, updateData);
        console.log('Update successful:', response.data);
    } catch (err) {
        console.error('Error updating worker:', err);
    }
};

// Exemplu de utilizare a funcției de actualizare
const workerId = '123'; // ID-ul lucrătorului
const updateData = {
    fullName: 'Andrei Ceaetchii',
    contact: '+37368126025'
};

// Apelul funcției de actualizare
updateWorker(workerId, updateData);
