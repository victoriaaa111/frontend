import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OurWorkers.css'; // Importăm fișierul CSS

const OurWorkers = () => {
  const { service } = useParams();
  const [filterMester, setFilterMester] = useState([]);
  const navigate = useNavigate();

  // Funcția pentru a prelua lucrătorii din baza de date
  const fetchMesteri = async () => {
    try {
      const response = await fetch('/api/mesteri'); // Endpoint-ul tău de API
      const data = await response.json();
      applyFilter(data);
    } catch (error) {
      console.error('Error fetching mesteri:', error);
    }
  };

  const applyFilter = (mesteri) => {
    if (service) {
      setFilterMester(mesteri.filter((mester) => mester.service === service));
    } else {
      setFilterMester(mesteri);
    }
  };

  useEffect(() => {
    fetchMesteri(); // Preluăm datele când componenta este montată
  }, [service]);

  return (
    <div>
      <p className="text-gray-600">Browse through the mesteri specialist.</p>
      <div className="container">
        <div className="sidebar">
          <p
            onClick={() =>
              service === 'Electrician'
                ? navigate('/mesteri')
                : navigate('/mesteri/Electrician')
            }
            className={`sidebar-item ${service === 'Electrician' ? 'active' : ''}`}
          >
            Electrician
          </p>
          <p
            onClick={() =>
              service === 'Plumber'
                ? navigate('/mesteri')
                : navigate('/mesteri/Plumber')
            }
            className={`sidebar-item ${service === 'Plumber' ? 'active' : ''}`}
          >
            Plumber
          </p>
          <p
            onClick={() =>
              service === 'Carpenter'
                ? navigate('/mesteri')
                : navigate('/mesteri/Carpenter')
            }
            className={`sidebar-item ${service === 'Carpenter' ? 'active' : ''}`}
          >
            Carpenter
          </p>
          <p
            onClick={() =>
              service === 'Locksmith'
                ? navigate('/mesteri')
                : navigate('/mesteri/Locksmith')
            }
            className={`sidebar-item ${service === 'Locksmith' ? 'active' : ''}`}
          >
            Locksmith
          </p>
          <p
            onClick={() =>
              service === 'Joiner'
                ? navigate('/mesteri')
                : navigate('/mesteri/Joiner')
            }
            className={`sidebar-item ${service === 'Joiner' ? 'active' : ''}`}
          >
            Joiner
          </p>
          <p
            onClick={() =>
              service === 'Gardener'
                ? navigate('/mesteri')
                : navigate('/mesteri/Gardener')
            }
            className={`sidebar-item ${service === 'Gardener' ? 'active' : ''}`}
          >
            Gardener
          </p>
        </div>

        <div className="grid">
          {filterMester.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="card"
            >
              <img className="image" src={item.image} alt={item.name} />
              <div className="card-content">
                <div className="status">
                  <p className="status-dot"></p>
                  <p>Available</p>
                </div>
                <p className="name">{item.name}</p>
                <p className="service">{item.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurWorkers;
