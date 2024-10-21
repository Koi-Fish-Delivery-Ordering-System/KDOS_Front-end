import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/records.css";

const Records = () => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

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
    if (selectedStatuses.length === 0 || selectedStatuses.length === statuses.length) {
      return "All";
    }
    if (selectedStatuses.length === 1) {
      return selectedStatuses[0];
    }
    return `${selectedStatuses.length} selected`;
  };

  const getMinSelectableDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  };

  const getMaxSelectableDate = () => {
    return new Date();
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
          <div className="combinedFilter">
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
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={getMinSelectableDate()}
                maxDate={getMaxSelectableDate()}
                dateFormat="dd-MM-yyyy" // Day-Month-Year format
                className="dateInput"
                ref={startDateRef}
              />
              <span className="dateArrow">→</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={getMaxSelectableDate()}
                dateFormat="dd-MM-yyyy" // Day-Month-Year format
                className="dateInput"
                ref={endDateRef}
              />
              <button
                type="button"
                className="calendarIcon"
                onClick={() => startDateRef.current.setFocus()}
              >
                📅
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="emptyState">
        <img src="empty-state.png" alt="Empty State" className="emptyImage" />
        <p>It looks like you have never placed an order. Maybe it is time to place your first order! =)</p>
      </div>
    </div>
  );
};

export default Records;
