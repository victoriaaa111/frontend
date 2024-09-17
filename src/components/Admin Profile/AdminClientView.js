import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAppointmentView.css'; // Asigură-te că ai stilurile dorite

const AdminClient = () => {
    const [clients, setClients] = useState([]); // Stocarea listei de clienți
    const [loading, setLoading] = useState(true); // Starea de încărcare
    const [error, setError] = useState(null); // Gestionarea erorilor

    // Funcția pentru a prelua clienții din baza de date
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('/api/clients'); // Schimbă endpoint-ul cu cel corect pentru API-ul tău
                setClients(response.data); // Setează clienții în state
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch clients');
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    // Afișarea stării de încărcare sau eroare
    if (loading) {
        return <p>Loading clients...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Clients List</h1>
            <table>
                <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Code (6 digits)</th>
                    <th>Contact Number</th>
                    <th>Status (Active/Inactive)</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.fullName}</td>
                        <td>{client.code}</td>
                        <td>{client.contactNumber}</td>
                        <td>{client.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminClient;
