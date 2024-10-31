import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/additionalservicemanager.css';

function AdditionalserviceManagement() {
  const [additionalservices, setAdditionalservices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    additionalServiceId: '',
    description: '',
    transportType: '',
    name: '',
    price: ''
  });
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchAdditionalservices = async () => {
      try {
        const response = await axios.get('https://67040f16ab8a8f892732c8b7.mockapi.io/account');
        setAdditionalservices(response.data);
      } catch (error) {
        console.error('Error fetching additionalservices:', error);
      }
    };

    fetchAdditionalservices();
  }, []);

  const handleCreate = () => {
    setFormData({ additionalServiceId: '', description: '', transportType: '', name: '', price: '' });
    setIsUpdate(false);
    setShowForm(true);
  };

  const handleUpdate = (id) => {
    const additionalservice = additionalservices.find(a => a.serviceid === id);
    setFormData({ ...additionalservice });
    setIsUpdate(true);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      await axios.put(`https://67040f16ab8a8f892732c8b7.mockapi.io/account/${formData.serviceid}`, formData);
      alert('Update successful!');
    }
    setShowForm(false);
    const response = await axios.get('https://67040f16ab8a8f892732c8b7.mockapi.io/account');
    setAdditionalservices(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://api.example.com/account/${id}`);
    const response = await axios.get('https://api.example.com/account');
    setAdditionalservices(response.data);
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(additionalservices.length / itemsPerPage);
  const paginatedData = additionalservices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  return (
    <div>
      <h1>Additionalservice Management</h1>
      <button className="transport-button" onClick={handleCreate}>Create Additionalservice</button>
      <table className="transport-table">
        <thead>
          <tr>
            <th>Service ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Transport Type</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(additionalservice => (
            <tr key={additionalservice.serviceid}>
              <td>{additionalservice.serviceid}</td>
              <td>{additionalservice.name}</td>
              <td>{additionalservice.description}</td>
              <td>{additionalservice.type}</td>
              <td>{additionalservice.price}</td>
              <td>
                <button className="transport-button" onClick={() => handleUpdate(additionalservice.serviceid)}>Update</button>
                <button className="transport-button" onClick={() => handleDelete(additionalservice.serviceid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button className="arrow-button" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&laquo;</button>
        <button className="arrow-button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lsaquo;</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button className="arrow-button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&rsaquo;</button>
        <button className="arrow-button" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className="page-select"
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index} value={index + 1}>
              Page {index + 1}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowForm(false)}>&times;</span>
            <h2>{isUpdate ? 'Update Additionalservice' : 'Create Additionalservice'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Transport Type:</label>
                <select name="transportType" value={formData.type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="road">Road</option>
                  <option value="air">Air</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} />
              </div>
              <div className="form-actions">
                <button type="submit" className="go-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdditionalserviceManagement;