import React, { useState } from "react";
import "../../css/records.css";

const Records = () => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const statuses = [
    "Order Confirmed / Finding Driver",
    "Awaiting Driver",
    "In Transit",
    "Delivering",
    "Confirming Bill",
    "Settle Bill",
    "Completed",
    "Cancelled"
  ];

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getStatusText = () => {
    if (selectedStatuses.length === statuses.length) {
      return "All";
    }
    return `${selectedStatuses.length} selected`;
  };

  return (
    <div className="records">
      <h2 className="title">Records</h2>
      <div className="searchAndToggleContainer">
        <div className="searchContainer">
          <input type="text" placeholder="Search by delivery info" className="searchInput" />
        </div>
        <div className="toggleContainer">
          <button onClick={toggleFilters} className="toggleFiltersButton">
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="filterContainer">
          <div className="statusFilter">
            <button onClick={toggleDropdown} className="dropdownButton">
              Status: {getStatusText()}
            </button>
            {dropdownOpen && (
              <div className="checkboxDropdown">
                {statuses.map((status) => (
                  <label key={status} className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusChange(status)}
                    />
                    {status}
                  </label>
                ))}
                <button className="resetButton" onClick={() => setSelectedStatuses([])}>Reset</button>
              </div>
            )}
          </div>
          <div className="dateFilter">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="dateInput" 
            />
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="dateInput" 
            />
          </div>
        </div>
      )}
      <div className="emptyState">
        <img src="path/to/your/image.png" alt="Empty State" className="emptyImage" />
        <p>It looks like you have never placed an order. Maybe it is time to place your first order! =)</p>
      </div>
    </div>
  );
};

export default Records;