import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/transportservice.css';

function TransportService() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceKM: '',
    priceKg: ''
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [disabledItems, setDisabledItems] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://6512cbd1b8c6ce52b396392e.mockapi.io/manager');
        const apiData = response.data;
        const storedData = JSON.parse(localStorage.getItem('transportData')) || [];
        const combinedData = [...apiData, ...storedData];
        setData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const apiDataIds = new Set(data.map(item => item.id));
    const newEntries = data.filter(item => !apiDataIds.has(item.id));
    localStorage.setItem('transportData', JSON.stringify(newEntries));
  }, [data]);

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      priceKM: '',
      priceKg: ''
    });
    setIsUpdate(false);
    setShowForm(true);
  };

  const handleUpdate = (id) => {
    const item = data.find(d => d.id === id);
    setFormData({
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      priceKM: item.priceKM || '',
      priceKg: item.priceKg || '',
      deliveryPrice: item.deliveryPrice || '',
      priceFish: item.priceFish || '',
    });
    setIsUpdate(true);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['priceKM', 'priceKg', 'deliveryPrice', 'priceFish'].includes(name) && value < 0) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDate = new Date().toLocaleDateString();
    if (isUpdate) {
      const updatedData = data.map(item =>
        item.id === formData.id ? { ...formData, updatedDate } : item
      );
      setData(updatedData);
      console.log('Update Data:', formData);
    } else {
      const newEntry = {
        id: data.length + 1,
        ...formData,
        updatedDate
      };
      setData([...data, newEntry]);
    }
    setShowForm(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleDisable = (id) => {
    setDisabledItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <h1>Transport Service</h1>
      <table className="transport-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Type</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className={disabledItems.has(item.id) ? 'disabled-row' : ''}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description || 'N/A'}</td>
              <td>{item.updatedDate || 'N/A'}</td>
              <td>
                <button className="transport-button" onClick={() => handleUpdate(item.id)}>Update</button>
                <button
                  className={`transport-button ${disabledItems.has(item.id) ? 'enable-button' : ''}`}
                  onClick={() => handleToggleDisable(item.id)}
                >
                  {disabledItems.has(item.id) ? 'Enable' : 'Disable'}
                </button>
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
      <button className="transport-button" onClick={handleCreate}>Create Transport Service</button>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowForm(false)}>&times;</span>
            <h2>{isUpdate ? 'Update Transport Service' : 'Create Transport Service'}</h2>
            <form onSubmit={handleSubmit}>
              {isUpdate ? (
                <>
                  <div className="form-group">
                    <label>Delivery Price:</label>
                    <input type="number" name="deliveryPrice" value={formData.deliveryPrice} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Price Fish:</label>
                    <input type="number" name="priceFish" value={formData.priceFish} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Price per KG:</label>
                    <input type="number" name="priceKg" value={formData.priceKg} onChange={handleChange} required />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Price per KM:</label>
                    <input type="number" name="priceKM" value={formData.priceKM} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Price per KG:</label>
                    <input type="number" name="priceKg" value={formData.priceKg} onChange={handleChange} required />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransportService;
