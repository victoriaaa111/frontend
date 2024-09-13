import React, { useContext, useState } from 'react';
import {
    workerGetDataApi, workerPutUpdateDataApi} from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import { useEffect } from 'react';
import './Worker.css';


const WorkerProfile = () => {
    const { auth } = useContext(AuthContext);
    const { workerId } = auth;
    const [worker, setWorker] = useState({
        fullName: '',
        username: '',
        email: '',
        contact: '',
        password: '',
        profilePicture: null,
        services: []
    });

    const [updatedWorker, setUpdatedWorker] = useState({
        fullName: '',
        contact: ''
    });

    const [newService, setNewService] = useState({
        serviceName: '',
        moreService: '',
        serviceDescription: '',
        hourlyRate: ''
    });

    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const fetchWorkerProfile = async () => {
            try {
                const response = await workerGetDataApi(workerId).get(`http://3.70.72.246:3001/worker/${workerId}`);
                const workerData = response.data;
                setWorker(workerData);
                setUpdatedWorker({
                    fullName: workerData.fullName,
                    contact: workerData.contact,
                });
            } catch (err) {
                setResponseMessage('Error fetching worker profile: ${error.message}')
            }
        };
        if (workerId) {
            fetchWorkerProfile();
        }
    }, [workerId]);

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

    const validatePhone = (contact) => {
        const phoneRegex = /^\+?[0-9]{9,14}$/;
        return phoneRegex.test(contact);
    };

    const validateFields = (isServiceValidation = false) => {
        const newErrors = {};

        if (!updatedWorker.fullName) newErrors.fullName = 'Full name is required';
        if (!updatedWorker.contact || !validatePhone(updatedWorker.contact)) newErrors.contact = 'Invalid contact number';

        if (isServiceValidation) {
            if (!newService.serviceName) newErrors.serviceName = 'Service name is required';
            if (!newService.hourlyRate || isNaN(newService.hourlyRate)) newErrors.hourlyRate = 'Hourly rate must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


     const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedWorker((prevWorker) => ({
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
        baseURL: `http://3.70.72.246:3001/worker/edit/${workerId}`, 
    });

    const updateWorkerDetails = async (e) => {
        e.preventDefault();
        if (validateFields()) {
            console.log('Vasea');
            try {
                const response = await workerPutUpdateDataApi(workerId).put(`http://3.70.72.246:3001/worker/edit/${workerId}`,
                    JSON.stringify(updatedWorker),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
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
                {/* <button
                    className="change-picture-btn"
                    onClick={() => document.getElementById('file-input').click()}
                >
                    Change Picture
                </button> */}
            </div>

            <div className="devider">
                <div className="right">
                    <div className="worker-info">
                        <form onSubmit={updateWorkerDetails}>
                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder={worker.fullName}
                                value={updatedWorker.fullName}
                                onChange={handleUpdateInputChange}
                            />
                            {errors.fullName && <p className="error">{errors.fullName}</p>}

                            <label>Email:</label>
                            <input
                                disabled
                                type="email"
                                name="email"
                                placeholder={worker.email}
                                value={updateWorkerDetails.email}
                            />
                            {errors.email && <p className="error">{errors.email}</p>}

                            <label>Username:</label>
                            <input
                                disabled
                                type="text"
                                name="username"
                                placeholder={worker.username}
                                value={worker.username}
                            />
                            {errors.username && <p className="error">{errors.username}</p>}

                            <label>Contact Number:</label>
                            <input
                                type="tel"
                                name="contact"
                                placeholder={worker.contact}
                                value={updateWorkerDetails.contact}
                                onChange={handleUpdateInputChange}
                            />
                            {errors.contact && <p className="error">{errors.contact}</p>}
{/* 
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter a password"
                                value={worker.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <p className="error">{errors.password}</p>} */}

                            <button
                                type="submit"
                                className="update-details-btn"
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
