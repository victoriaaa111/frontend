import React, { useState } from 'react';
import './Worker.css';

const WorkerProfile = () => {
    const [worker, setWorker] = useState({
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        ratings: '',
        profilePicture: null // To store the uploaded picture
    });

    const [newService, setNewService] = useState({
        serviceName: '',
        serviceDescription: '',
        hourlyRate: ''
    });

    const [errors, setErrors] = useState({}); // To store validation errors

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setWorker((prevWorker) => ({
                    ...prevWorker,
                    profilePicture: e.target.result // Store the image data URL
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phoneNumber) => {
        const phoneRegex = /^[0-9]{9}$/;
        return phoneRegex.test(phoneNumber);
    };

    const validateFields = () => {
        const newErrors = {};

        if (!worker.name) newErrors.name = 'Name is required';
        if (!worker.surname) newErrors.surname = 'Surname is required';
        if (!worker.email || !validateEmail(worker.email)) newErrors.email = 'Invalid email';
        if (!worker.phoneNumber || !validatePhone(worker.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';

        if (!newService.serviceName) newErrors.serviceName = 'Service name is required';
        if (!newService.hourlyRate || isNaN(newService.hourlyRate)) newErrors.hourlyRate = 'Hourly rate must be a number';

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

    const addService = () => {
        if (validateFields()) {
            setWorker((prevWorker) => ({
                ...prevWorker,
                services: [...prevWorker.services, newService]
            }));
            setNewService({
                serviceName: '',
                serviceDescription: '',
                hourlyRate: ''
            });
        }
    };

    const updateWorkerDetails = () => {
        if (validateFields()) {
            console.log('Worker details updated:', worker);
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
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Vasile"
                            value={worker.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}

                        <label>Surname:</label>
                        <input
                            type="text"
                            name="surname"
                            placeholder="Vasilev"
                            value={worker.surname}
                            onChange={handleInputChange}
                        />
                        {errors.surname && <p className="error">{errors.surname}</p>}

                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="vasile@vasilev.com"
                            value={worker.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}

                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="074123456"
                            value={worker.phoneNumber}
                            onChange={handleInputChange}
                        />
                        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

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
                    
                    <div className="rating">
                        <label><b>Ratings: </b></label>
                        <input
                            type="text"
                            name="ratings"
                            placeholder='5.0'
                            value={worker.ratings}
                            onChange={handleInputChange}
                        />
                    </div>
                    <ul className="service-list">
                        {worker.services && worker.services.map((service, index) => (
                            <li key={index}>
                                {service.serviceName} - {service.serviceDescription} (${service.hourlyRate}/hr)
                            </li>
                        ))}
                    </ul>

                    <div className="actions">
                        <button className="save-changes-btn">Save</button>
                        <button className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerProfile;
