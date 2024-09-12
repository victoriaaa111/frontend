import React, { useState } from 'react';
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
        const phoneRegex = /^\+?[0-9]{9,14}$/; // Actualizat pentru a permite numere cu prefixul '+'
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

    const updateWorkerDetails = () => {
        if (validateFields()) {
            const details = {
                fullName: worker.fullName,
                username: worker.username,
                email: worker.email,
                contact: worker.contact,
                password: worker.password,
            };

            const jsonData = JSON.stringify(details, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'worker_personal_details.json';
            link.click();

            console.log('Worker details updated:', details);
        }
    };

    const addService = () => {
        if (validateFields(true)) {
            const updatedWorker = {
                ...worker,
                services: [...worker.services, newService]
            };

            setWorker(updatedWorker);

            const jsonData = JSON.stringify(updatedWorker, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'worker_services.json';
            link.click();

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

            <div className='devider'>
                <div className='right'>
                    <div className="worker-info">
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

                        <button className="update-details-btn" onClick={updateWorkerDetails}>
                            Update Details
                        </button>
                    </div>        
                </div>

                <div className='left'>
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

                        <button className="add-service-btn" onClick={addService}>
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

                    <div className="actions">
                        <button className="save-changes-btn" onClick={addService}>Save</button>
                        <button className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerProfile;
