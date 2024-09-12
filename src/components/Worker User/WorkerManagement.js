import React, { useState } from 'react';
import axios from 'axios';
import './Worker.css';

const WorkerProfile = () => {
    const [worker, setWorker] = useState({
        fullName: '',
        username: '',
        email: '',
        contact: '',
        password: '',
        profilePicture: null,
        services: []
    });

    const [newService, setNewService] = useState({
        serviceName: '',
        moreService: '',
        serviceDescription: '',
        hourlyRate: ''
    });

    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState('');
    const workerId = "66de0492e489a3e530a6ff5e"; // Exemplu de workerId, ar trebui să fie dinamic

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setWorker((prevWorker) => ({
                    ...prevWorker,
                    profilePicture: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (contact) => {
        const phoneRegex = /^\+?[0-9]{9,14}$/;
        return phoneRegex.test(contact);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateFields = (isServiceValidation = false) => {
        const newErrors = {};

        if (!worker.fullName) newErrors.fullName = 'Full name is required';
        if (!worker.username) newErrors.username = 'Username is required';
        if (!worker.email || !validateEmail(worker.email)) newErrors.email = 'Invalid email';
        if (!worker.contact || !validatePhone(worker.contact)) newErrors.contact = 'Invalid contact number';
        if (!worker.password || !validatePassword(worker.password)) newErrors.password = 'Password must be at least 6 characters';

        if (isServiceValidation) {
            if (!newService.serviceName) newErrors.serviceName = 'Service name is required';
            if (!newService.hourlyRate || isNaN(newService.hourlyRate)) newErrors.hourlyRate = 'Hourly rate must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorker((prevWorker) => ({
            ...prevWorker,
            [name]: value
        }));
    };

    const handleServiceChange = (e) => {
        const { name, value } = e.target;
        setNewService((prevService) => ({
            ...prevService,
            [name]: value
        }));
    };

    const workerProfileAPI = axios.create({
        baseURL: `http://3.70.72.246:3001/worker/edit/${workerId}`, // Endpoint-ul corect pentru editare
    });

    const updateWorkerDetails = async () => {
        if (validateFields()) {
            const details = {
                fullName: worker.fullName,
                username: worker.username,
                email: worker.email,
                contact: worker.contact,
                password: worker.password,
                profilePicture: worker.profilePicture,
                services: worker.services,
            };

            try {
                const response = await workerProfileAPI.put('/', details);
                setResponseMessage('Worker details updated successfully');
                console.log('Worker details updated:', response.data);
            } catch (error) {
                setResponseMessage(`Error updating worker details: ${error.response?.data?.message || error.message}`);
                console.error('Error updating worker details:', error);
            }
        }
    };

    const addService = async () => {
        if (validateFields(true)) {
            const updatedWorker = {
                ...worker,
                services: [...worker.services, newService]
            };

            setWorker(updatedWorker);

            try {
                // Actualizarea serviciilor muncitorului pe server
                const response = await workerProfileAPI.put('/', updatedWorker);
                setResponseMessage('Worker services updated successfully');
                console.log('Worker services updated:', response.data);
            } catch (error) {
                setResponseMessage('Error updating worker services');
                console.error('Error updating worker services:', error);
            }

            setNewService({
                serviceName: '',
                moreService: '',
                serviceDescription: '',
                hourlyRate: ''
            });
        }
    };

    return (
        <div className="worker-profile-container">
            <h1>Worker Profile Management</h1>

            <div className="profile-picture">
                <div className="profile-image">
                    {worker.profilePicture ? (
                        <img src={worker.profilePicture} alt="Profile" />
                    ) : (
                        <div className="placeholder-image"></div>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    id="file-input"
                    style={{ display: 'none' }}
                    onChange={handlePictureChange}
                />
                <button
                    className="change-picture-btn"
                    onClick={() => document.getElementById('file-input').click()}
                >
                    Change Picture
                </button>
            </div>

            <div className="devider">
                <div className="right">
                    <div className="worker-info">
                        <form>
                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Ion Berzedeanu"
                                value={worker.fullName}
                                onChange={handleInputChange}
                            />
                            {errors.fullName && <p className="error">{errors.fullName}</p>}

                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="ionberzedeanu@gmail.com"
                                value={worker.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <p className="error">{errors.email}</p>}

                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="ion!2"
                                value={worker.username}
                                onChange={handleInputChange}
                            />
                            {errors.username && <p className="error">{errors.username}</p>}

                            <label>Contact Number:</label>
                            <input
                                type="tel"
                                name="contact"
                                placeholder="+37368126027"
                                value={worker.contact}
                                onChange={handleInputChange}
                            />
                            {errors.contact && <p className="error">{errors.contact}</p>}

                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter a password"
                                value={worker.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <p className="error">{errors.password}</p>}

                            <button
                                type="button"
                                className="update-details-btn"
                                onClick={updateWorkerDetails}
                            >
                                Update Details
                            </button>
                        </form>
                        {responseMessage && <p>{responseMessage}</p>}
                    </div>
                </div>

                <div className="left">
                    <div className="worker-info">
                        <label>Service Offered:</label>
                        <input
                            type="text"
                            name="serviceName"
                            placeholder="Service Name"
                            value={newService.serviceName}
                            onChange={handleServiceChange}
                        />
                        {errors.serviceName && <p className="error">{errors.serviceName}</p>}

                        <label>Add more service:</label>
                        <input
                            type="text"
                            name="moreService"
                            placeholder="Additional Service"
                            value={newService.moreService}
                            onChange={handleServiceChange}
                        />

                        <label>Service Description: </label>
                        <input
                            type="text"
                            name="serviceDescription"
                            placeholder="Service Description"
                            value={newService.serviceDescription}
                            onChange={handleServiceChange}
                        />

                        <label>Hourly Rate: </label>
                        <input
                            type="number"
                            name="hourlyRate"
                            placeholder="Hourly Rate"
                            value={newService.hourlyRate}
                            onChange={handleServiceChange}
                        />
                        {errors.hourlyRate && <p className="error">{errors.hourlyRate}</p>}

                        <button
                            type="button"
                            className="add-service-btn"
                            onClick={addService}
                        >
                            Add Service
                        </button>
                    </div>

                    <ul className="service-list">
                        {worker.services && worker.services.map((service, index) => (
                            <li key={index}>
                                {service.serviceName} - {service.serviceDescription} (${service.hourlyRate}/hr)
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WorkerProfile;
