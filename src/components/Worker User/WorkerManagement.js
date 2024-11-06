import React, { useContext, useState, useEffect, useRef } from 'react';

import AuthContext from '../../context/AuthProvider';
import './Worker.css';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const SERVICE_NAME_REGEX = /^[a-zA-Z0-9\s]{1,100}$/; // Example pattern
const DESCRIPTION_REGEX = /^[a-zA-Z0-9\s,.!?]{1,500}$/; // Example pattern
const PRICE_REGEX = /^\d+(\.\d{1,2})?$/; // Example pattern for price with up to 2 decimal places
const WORK_REGEX = /^(?:[0-9]|1[0-9]|2[0-3])$/


const WorkerProfile = () => {
    const { auth } = useContext(AuthContext);
    const { workerId } = auth;
    const [services, setServices] = useState([]);
    const [worker, setWorker] = useState({
        fullName: '',
        uniqueId: '',
        email: '',
        contact: '',
        startWork: '',
        endWork: '',
        password: '',
        profilePicture: null,
        services: []
    });
    const [updatedWorker, setUpdatedWorker] = useState({
        fullName: '',
        contact: '',
        startWork: '',
        endWork:''
    });
    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [errMsgUpdate, setErrMsgUpdate] = useState('');
    const userRef = useRef();
    const errRef = useRef();


    const [editServiceId, setEditServiceId] = useState(null);
    const [editServiceData, setEditServiceData] = useState({
        service: '',
        description: '',
        price: ''
    });
    

    useEffect(() => {
        const fetchWorkerProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/worker/${workerId}`);
                const workerData = response.data;
                let contact = workerData.contact;
                contact = `+${contact}`;

                setWorker(workerData);
                setUpdatedWorker({
                    fullName: workerData.fullName,
                    contact: contact,
                    startWork: workerData.startWork,
                    endWork: workerData.endWork
                });
            } catch (err) {
                setResponseMessage(`Error fetching worker profile: ${err.message}`);
            }
        };
        if (workerId) {
            fetchWorkerProfile();
        }
    }, [workerId]);
    const fetchServices = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/worker/${workerId}`);
        const serviceData = response.data.services.map(service => ({
            id: service._id,
            service: service.service,
            description: service.description,
            price: Number(service.price)
        }));
        setServices(serviceData);
    } catch (err) {
        console.log("Error fetching services: ", err);
    }
};


    useEffect(() => {
    if (workerId) {
        fetchServices();
    }
}, [workerId]);


    const validatePhone = (contact) => {
        const phoneRegex = /^\+?[0-9]{9,14}$/;
        return phoneRegex.test(contact);
    };

    const validateFields = (isServiceValidation = false) => {
        const newErrors = {};

        if (!updatedWorker.fullName) newErrors.fullName = 'Full name is required';
        if (updatedWorker.startWork > updatedWorker.endWork) newErrors.fullName = 'Start Work Hour should be smaller than End Work Hour';
        if (!updatedWorker.contact || !validatePhone(updatedWorker.contact)) newErrors.contact = 'Invalid contact number';        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedWorker((prevWorker) => ({
        ...prevWorker,
        [name]: name === "startWork" || name === "endWork" ? Number(value) : value
    }));
};


    const updateWorkerDetails = async (e) => {
        e.preventDefault();
        setErrors({});
        setResponseMessage('');
        if (validateFields()) {
            try {
                const response = await axios.put(
                    `http://localhost:3001/worker/edit/${workerId}`,
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

    const [service, setService] = useState('');
    const [validService, setValidService] = useState(false);
    const [serviceFocus, setServiceFocus] = useState(false);
    const [validServiceUpdate, setValidServiceUpdate] = useState(false);
    const [serviceUpdateFocus, setServiceUpdateFocus] = useState(false);
    const [description, setDescription] = useState('');
    const [validDescription, setValidDescription] = useState(false);
    const [descriptionFocus, setDescriptionFocus] = useState(false);
    const [validDescriptionUpdate, setValidDescriptionUpdate] = useState(false);
    const [descriptionUpdateFocus, setDescriptionUpdateFocus] = useState(false);
    const [price, setPrice] = useState('');
    const [validPrice, setValidPrice] = useState(false);
    const [priceFocus, setPriceFocus] = useState(false);
    const [validPriceUpdate, setValidPriceUpdate] = useState(false);
    const [priceUpdateFocus, setPriceUpdateFocus] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = SERVICE_NAME_REGEX.test(service);
        setValidService(result);
    }, [service])

    useEffect(() => {
        const result = DESCRIPTION_REGEX.test(description);
        setValidDescription(result);
    }, [description])

    useEffect(() => {
        const result = PRICE_REGEX.test(price);
        setValidPrice(result);
    }, [price])

    useEffect(() => {
        const result = SERVICE_NAME_REGEX.test(editServiceData.service);
        setValidServiceUpdate(result);
    }, [editServiceData.service])

    useEffect(() => {
        const result = DESCRIPTION_REGEX.test(editServiceData.description);
        setValidDescriptionUpdate(result);
    }, [editServiceData.description])

    useEffect(() => {
        const result = PRICE_REGEX.test(editServiceData.price);
        setValidPriceUpdate(result);
    }, [price])

    useEffect(() => {
        setErrMsg('')
    }, [service, description, price])
    useEffect(() => {
        setErrMsgUpdate('')
    }, [editServiceData.service, editServiceData.description, editServiceData.price])

    const HandleSubmit = async (e) => {
    e.preventDefault();

    const v1 = SERVICE_NAME_REGEX.test(service);
    const v2 = DESCRIPTION_REGEX.test(description);
    const v3 = PRICE_REGEX.test(price);

    if (!v1 || !v2 || !v3) {
        setErrMsg("Invalid Entry");
        errRef.current.focus();
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:3001/worker/add/${workerId}`,
            JSON.stringify({ id: null, service, description, price: Number(price) }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        const newService = {
            id: response.data._id,
            service,
            description,
            price: Number(price)
        };

        // Update services state
        setServices(prevServices => [...prevServices, newService]);

        // Fetch updated list of services
        fetchServices();

        // Reset the input fields
        setService('');
        setDescription('');
        setPrice('');
        setErrMsg('');
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Invalid Data. Check your inputs.');
        } else if (err.response?.status === 500) {
            setErrMsg('Server error. Please try again later.');
        } else if (err?.response?.data?.message) {
            setErrMsg(err.response.data.message);
        } else {
            setErrMsg('Adding Service Failed. Please try again later.');
        }
        errRef.current.focus();
    }
};


    const handleEditClick = (service) => {
        setEditServiceId(service.id)
        setEditServiceData({
            service: service.service,
            description: service.description,
            price: Number(service.price)
        });
    };

    // const handleEditServiceChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditServiceData(prevData => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };
    const handleEditServiceChange = (e) => {
    const { name, value } = e.target;

    setEditServiceData(prevData => ({
        ...prevData,
        [name]: name === "price" ? Number(value) : value
    }));
};


    const handleUpdateService = async (e) => {
    e.preventDefault();

    const v1 = SERVICE_NAME_REGEX.test(editServiceData.service);
    const v2 = DESCRIPTION_REGEX.test(editServiceData.description);
    const v3 = PRICE_REGEX.test(Number(editServiceData.price));

    if (!v1 || !v2 || !v3) {
        setErrMsgUpdate("Invalid Entry");
        errRef.current.focus();
        return;
    }

    // Check for duplicate service
    const isDuplicate = services.some(existingService =>
        existingService.service.toLowerCase() === editServiceData.service.toLowerCase() &&
        existingService.id !== editServiceId // Ensure that we're not checking the service we're currently editing
    );
    if (isDuplicate) {
        setErrMsgUpdate('This service already exists.');
        errRef.current.focus();
        return;
    }

        try {
            console.log(editServiceData);
            console.log(editServiceId);
        const response = await axios.post(
            `http://localhost:3001/worker/add/${workerId}`,
            JSON.stringify({
                id: editServiceId,
                service: editServiceData.service,
                description: editServiceData.description,
                price: Number(editServiceData.price)
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        
        // Update services with edited service
        const updatedServices = services.map(service =>
            service.id === editServiceId ? { ...service, ...editServiceData, price: Number(editServiceData.price) } : service
        );
        setServices(updatedServices);

        // Reset form
        setEditServiceId(null);
        setEditServiceData({ service: '', description: '', price: '' });
        setErrMsgUpdate('');
    } catch (err) {
        console.error('Error updating service:', err);
        if (!err?.response) {
            setErrMsgUpdate('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsgUpdate('Invalid Data. Check your inputs.');
        } else if (err.response?.status === 500) {
            setErrMsgUpdate('Server error. Please try again later.');
        } else {
            setErrMsgUpdate('Updating Service Failed. Please try again.');
        }
        errRef.current.focus();
    }
};




    const handleDeleteService = async (serviceId) => {
    try {
        await axios.delete(
            `http://localhost:3001/worker/${workerId}/service/${serviceId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        // Update services state after deletion
        setServices(prevServices => {
            const updatedServices = prevServices.filter(service => service.id !== serviceId);
            localStorage.setItem('services', JSON.stringify(updatedServices));
            return updatedServices;
        });

    } catch (err) {
        console.error('Error deleting service:', err.message);
        setErrMsg('Failed to delete service. Please try again later.');
    }
};






    return (
        <div className="worker-profile-container">
            <div className='row'>
                <div className='column'>
                    <h1>Worker Profile Management</h1>

                    <div className="profile-picture">
                        <div className="profile-image2">
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
                        />
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
                                        value={worker.email}
                                    />
                                    {errors.email && <p className="error">{errors.email}</p>}

                                    <label>Id:</label>
                                    <input
                                        disabled
                                        type="text"
                                        name="uniqueId"
                                        placeholder={worker.uniqueId}
                                        value={worker.uniqueId}
                                    />
                                    {errors.uniqueId && <p className="error">{errors.uniqueId}</p>}

                                    <label>Contact Number:</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        placeholder={worker.contact}
                                        value={updatedWorker.contact}
                                        onChange={handleUpdateInputChange}
                                    />
                                    {errors.contact && <p className="error">{errors.contact}</p>}

                                    <label>Start Work Time:</label>
                                    <input
                                        type="number"
                                        name="startWork"
                                        placeholder={worker.startWork}
                                        value={updatedWorker.startWork}
                                        onChange={handleUpdateInputChange}
                                    />
                                    {errors.startWork && <p className="error">{errors.startWork}</p>}

                                    <label>End Work Time:</label>
                                    <input
                                        type="number"
                                        name="endWork"
                                        placeholder={worker.endWork}
                                        value={updatedWorker.endWork}
                                        onChange={handleUpdateInputChange}
                                    />
                                    {errors.endWork && <p className="error">{errors.endWork}</p>}

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
                    </div>
                </div>

                <div className="column" id="border">
                    <h1 className='title-profile'>Add Service</h1>
                    <div className="worker-info">
    <form onSubmit={HandleSubmit}>
        <p ref={errRef} className={errMsg ? 'errmsg' : "offscreen"} aria-live="assertive">{errMsg}</p>
        
        <label>Service Offered:</label>
        <input
            ref={userRef}
            required
            onFocus={() => setServiceFocus(true)}
            onBlur={() => setServiceFocus(false)}
            aria-invalid={validService ? "false" : "true"}
            aria-describedby="servicenote"
            type="text"
            name="service"
            placeholder="Service Name"
            value={service}
            onChange={(e) => setService(e.target.value)}
        />
        <p id="servicenote" className={serviceFocus && service && !validService ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle}/>
            Enter a name for the service. It can consist of letters, numbers, and spaces, with a maximum of 100 characters.
        </p>

        <label>Service Description: </label>
        <input
            onFocus={() => setDescriptionFocus(true)}
            onBlur={() => setDescriptionFocus(false)}
            aria-invalid={validDescription ? "false" : "true"}
            aria-describedby="descriptionnote"
            required
            type="text"
            name="description"
            placeholder="Service Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <p id="descriptionnote" className={descriptionFocus && description && !validDescription ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle}/>
            Provide a detailed description of the service, using up to 500 characters.
            You can include letters, numbers, punctuation (such as commas, periods, question marks, etc.), and spaces.
        </p>

        <label>Hourly Rate: </label>
        <input
            onFocus={() => setPriceFocus(true)}
            onBlur={() => setPriceFocus(false)}
            required
            type="number"
            name="price"
            placeholder="Hourly Rate"
            value={Number(price)}
            onChange={(e) => setPrice(Number(e.target.value))}
        />
        <p id="pricenote" className={priceFocus && price && !validPrice ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle}/>
            Enter the price for the service in numeric format. You may include up to two decimal places.
        </p>

        <button disabled={(!validService || !validDescription || !validPrice) ? true : false} type="submit" className="add-service-btn">
            Add Service
        </button>
    </form>
</div>

                    <h1 className='title-profile' id="services">Services</h1>
                    

                    <ul>
                        {services.map(service => (
                            <li key={service.id}>
                                {editServiceId === service.id ? (
                                    <form onSubmit={handleUpdateService}>
                                        <p ref={errRef} className={errMsgUpdate ? 'errmsg' : "offscreen"} aria-live="assertive">{errMsgUpdate}</p>
                                        <label>Service Offered:</label>
                                        <input
                                            type="text"
                                            name="service"
                                            value={editServiceData.service}
                                            onChange={handleEditServiceChange}
                                            onFocus={() => setServiceUpdateFocus(true)}
                                            onBlur={() => setServiceUpdateFocus(false)}
                                        />
                                        <p id="servicenote"
                               className={serviceUpdateFocus && editServiceData.service && !validServiceUpdate ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                Enter a name for the service.
                                <br/>
                                It can consist of letters, numbers, and spaces, with a maximum of 100 characters.
                            </p>
                                        <label>Service Description:</label>
                                        <textarea
                                            name="description"
                                            value={editServiceData.description}
                                            onChange={handleEditServiceChange}
                                            onFocus={() => setDescriptionUpdateFocus(true)}
                                            onBlur={() => setDescriptionUpdateFocus(false)}
                                        />
                                        <p id="descriptionnote"
                               className={descriptionUpdateFocus && editServiceData.description && !validDescriptionUpdate ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                Provide a detailed description of the service, using up to 500 characters.
                                <br/>
                                You can include letters, numbers, punctuation <br/>
                                (such as commas, periods, question marks, etc.), and spaces.
                            </p>
                                        <label>Hourly Rate:</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={Number(editServiceData.price)}
                                             onChange={(e) => handleEditServiceChange({ target: { name: 'price', value: Number(e.target.value) } })}
                                            onFocus={() => setPriceUpdateFocus(true)}
                                            onBlur={() => setPriceUpdateFocus(false)}
                                        />
                                        <p id="pricenote"
                               className={priceUpdateFocus && Number(editServiceData.price) && !validPriceUpdate ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                Enter the price for the service in numeric format. You may include up to two decimal
                                places.
                            </p>
                                        <button type="submit">Save</button>
                                    </form>
                                ) : (
                                    <>
                                        <p>Service: {service.service}</p>
                                        <p>Description: {service.description}</p>
                                        <p>Price: {Number(service.price)}</p>
                                        <button className = "edit" onClick={() => handleEditClick(service)}>Edit</button>
                                        <button className = "delete" onClick={() => handleDeleteService(service.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>
    );
}

export default WorkerProfile;
