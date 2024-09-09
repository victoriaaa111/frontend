import React, { useState } from 'react';

const ServiceOfferings = ({ profile, setProfile }) => {
  const [newService, setNewService] = useState({ name: '', description: '', hourlyRate: '' });

  const addService = () => {
    setProfile(prevProfile => ({
      ...prevProfile,
      services: [...prevProfile.services, newService],
    }));
    setNewService({ name: '', description: '', hourlyRate: '' });
  };

  const removeService = (index) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      services: prevProfile.services.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="service-offerings">
      <h2>Services Offered</h2>
      <ul>
        {profile.services.map((service, index) => (
          <li key={index}>
            {service.name} - {service.hourlyRate}/hr
            <button onClick={() => removeService(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Service Name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
        />
        <input
          placeholder="Service Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          value={newService.hourlyRate}
          onChange={(e) => setNewService({ ...newService, hourlyRate: e.target.value })}
        />
        <button onClick={addService}>Add Service</button>
      </div>
    </div>
  );
};

export default ServiceOfferings;
