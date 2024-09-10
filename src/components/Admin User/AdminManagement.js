import React, { useState, useEffect } from 'react';
import './Admin.css';
import NewUserForm from './NewUserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
  
    useEffect(() => {
      setUsers([
        { id: 1, name: 'Ion Popescu', email: 'ion@gmail.com', role: 'Angajat', status: 'Activ' },
        { id: 2, name: 'Ana Ionescu', email: 'ana@yahoo.com', role: 'Client', status: 'Inactiv' },
      ]);
    }, []);
  
    const filteredUsers = users
      .filter((user) => 
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        && (roleFilter === '' || user.role === roleFilter)
        && (statusFilter === '' || user.status === statusFilter)
      )
      .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  
    const totalPages = Math.ceil(users.length / usersPerPage);
    const handlePageChange = (page) => setCurrentPage(page);
  
    const toggleUserStatus = (userId) => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: user.status === 'Activ' ? 'Inactiv' : 'Activ' } : user
      ));
    };
  
    return (
      <div className="user-management container">
        {/* Formularul pentru adăugarea utilizatorilor este acum primul */}
        <div className="right-section">
          <NewUserForm onSave={(newUser) => setUsers([...users, newUser])} />
        </div>
  
        {/* Gestionarea utilizatorilor este mutată dedesubt */}
        <div className="left-section">
          <h1>Gestionare Utilizatori</h1>
  
          <div className="search-filters">
            <input 
              type="text" 
              placeholder="Căutare utilizatori..." 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <select onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Toate rolurile</option>
              <option value="Angajat">Angajat</option>
              <option value="Client">Client</option>
            </select>
            <select onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Toate statusurile</option>
              <option value="Activ">Activ</option>
              <option value="Inactiv">Inactiv</option>
            </select>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Nume</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Statut</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td className="actions">
                    <button>Vizualizează</button>
                    <button>Editează</button>
                    <button 
                      className={user.status === 'Activ' ? '' : 'reactivate'} 
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === 'Activ' ? 'Dezactivează' : 'Reactivează'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
};

export default UserManagement;
