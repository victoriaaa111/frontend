import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    serviceApi,
    workerGetDataApi, workerPutUpdateDataApi
} from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import './Worker.css';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SERVICE_NAME_REGEX = /^[A-Za-z0-9 ]{4,100}$/;
const DESCRIPTION_REGEX = /^[\w\s.,'"\-?!()]{4,500}$/;
const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;

const WorkerProfile = () => {
    const { auth } = useContext(AuthContext);
    const { workerId } = auth;

    const [worker, setWorker] = useState({
        fullName: '',
        uniqueId: '',
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

    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const fetchWorkerProfile = async () => {
            try {
                const response = await workerGetDataApi(workerId).get(`http://3.70.72.246:3001/worker/${workerId}`);
                const workerData = response.data;
                let contact = workerData.contact;
                contact = `+${contact}`;

                setWorker(workerData);
                setUpdatedWorker({
                    fullName: workerData.fullName,
                    contact: contact
                });
                
            } catch (err) {
                setResponseMessage(`Error fetching worker profile: ${err.message}`);
            }
        };
        if (workerId) {
            fetchWorkerProfile();
        }
    }, [workerId]);

    const validatePhone = (contact) => {
        const phoneRegex = /^\+?[0-9]{9,14}$/;
        return phoneRegex.test(contact);
    };

    const validateFields = (isServiceValidation = false) => {
        const newErrors = {};

        if (!updatedWorker.fullName) newErrors.fullName = 'Full name is required';
        if (!updatedWorker.contact || !validatePhone(updatedWorker.contact)) newErrors.contact = 'Invalid contact number';
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

    const updateWorkerDetails = async (e) => {
        e.preventDefault();
        setErrors({});
        setResponseMessage('');
        if (validateFields()) {
            try {
                const response = await workerPutUpdateDataApi(workerId).put(
                    `http://3.70.72.246:3001/worker/edit/${workerId}`,
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

    const userRef = useRef();
    const errRef = useRef();

    const [service, setService] = useState('');
    const [validService, setValidService] = useState(false);
    const [serviceFocus, setServiceFocus] = useState(false);

    const [description, setDescription] = useState('');
    const [validDescription, setValidDescription] = useState(false);
    const [descriptionFocus, setDescriptionFocus] = useState(false);

    const [price, setPrice] = useState('');
    const [validPrice, setValidPrice] = useState(false);
    const [priceFocus, setPriceFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

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
        setErrMsg('')
    }, [service, description, price])

    const HandleSubmit = async (e) => {
        e.preventDefault();  // Prevent form from submitting in traditional way

        const v1 = SERVICE_NAME_REGEX.test(service);
        const v2 = DESCRIPTION_REGEX.test(description);
        const v3 = PRICE_REGEX.test(price);

        // If any validation fails, show error message
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            errRef.current.focus();
            return;
        }

        try {
            // Make the API call to add the service
            const response = await serviceApi(workerId).post(
                `http://3.70.72.246:3001/worker/add/${workerId}`,
                JSON.stringify({ id: null, service, description, price }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            // Assuming the API response returns the new service object with an ID
            const newService = {
                id: response.data._id,  // Use the actual ID from the response
                service,
                description,
                price
            };

            // Update the services state by appending the new service
            setServices(prevServices => [...prevServices, newService]);

            // Save the updated services to local storage
            localStorage.setItem('services', JSON.stringify([...services, newService]));

            // Clear form inputs after adding the service
            setService('');
            setDescription('');
            setPrice('');
            setErrMsg('');  // Clear any previous errors
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
            errRef.current.focus();  // Focus the error message area
        }
    };

    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const savedServices = localStorage.getItem('services');
                if (savedServices) {
                    // Use the saved services from local storage
                    setServices(JSON.parse(savedServices));
                } else {
                    // Fetch services from the API if not available in local storage
                    const response = await workerGetDataApi(workerId).get(`http://3.70.72.246:3001/worker/${workerId}`);
                    const serviceData = response.data.services.map(service => ({
                        id: service._id,
                        service: service.service,
                        description: service.description,
                        price: service.price
                    }))
                    setServices(serviceData);
                    // Save the fetched services to local storage
                    localStorage.setItem('services', JSON.stringify(serviceData));
                }
            } catch (err) {
                console.log("Error fetching data: ", err);
            }
        };
        fetchServices();
    }, [workerId]);

    return (
        <div className="worker-profile-container">
            <div className='row'>
                <div className='column'>
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
                    <h1 className='title-profile'>Services</h1>
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
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Enter a name for the service.
                                <br />
                                It can consist of letters, numbers, and spaces, with a maximum of 100 characters.
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
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Provide a detailed description of the service, using up to 500 characters.
                                <br />
                                You can include letters, numbers, punctuation <br />
                                (such as commas, periods, question marks, etc.), and spaces.
                            </p>

                            <label>Hourly Rate: </label>
                            <input
                                onFocus={() => setPriceFocus(true)}
                                onBlur={() => setPriceFocus(false)}
                                required
                                type="number"
                                name="price"
                                placeholder="Hourly Rate"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <p id="pricenote" className={priceFocus && price && !validPrice ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Enter the price for the service in numeric format. You may include up to two decimal places.
                            </p>

                            <button disabled={(!validService || !validDescription || !validPrice) ? true : false}
                                type="submit"
                                className="add-service-btn"
                            >
                                Add Service
                            </button>
                        </form>
                    </div>

                    <ul>
                        {services.map(service => (
                            <li key={service.id}>
                                <h4>{service.service}</h4>
                                <p>{service.description}</p>
                                <p>Price: ${service.price}/h</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WorkerProfile;
