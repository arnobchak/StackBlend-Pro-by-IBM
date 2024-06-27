import React, { useState } from 'react';
import axios from 'axios';
import './AddShift.css';
import ShiftTable from './ShiftTable';

const AddShift = () => {
  const [shift, setShift] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    status: "In-Active"
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShift((prevShift) => ({
      ...prevShift,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { shiftName, startTime, endTime } = shift;
    if (shiftName && startTime && endTime) {
      axios.post("http://localhost:5000/AddShift", shift)
        .then(res => {
          alert(res.data.message);
          // Clear the form after successful submission
          setShift({
            shiftName: "",
            startTime: "",
            endTime: "",
            status: "In-Active"
          });
          window.location.reload();
          setErrorMessage("");
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage("An unexpected error occurred.");
          }
        });
    } else {
      setErrorMessage("Please fill in all fields");
    }
  };

  return (
    <div className='mainContainer'>
      <div className='addShiftContainer'>
        <div className='addShiftFormBox'>
          <div>
            <h4 id="addShiftFormHeading">Add Shift Details</h4>
          </div>
          <div className='addShiftDiv'>
            <select
              className="form-select"
              name="shiftName"
              value={shift.shiftName}
              onChange={handleChange}>
              <option value="">Select Shift</option>
              <option value="Morning">Morning Shift</option>
              <option value="Evening">Evening Shift</option>
              <option value="Night">Night Shift</option>
              <option value="General">General Shift</option>
            </select>
          </div>
          <div className='addShiftDiv'>
            <label className='inputAddShiftLabel'>Start Time</label>
            <input
              className='form-control'
              type='time'
              placeholder='Enter Start Time'
              name="startTime"
              value={shift.startTime}
              onChange={handleChange}
            />
          </div>
          <div className='addShiftDiv'>
            <label className='inputAddShiftLabel'>End Time</label>
            <input
              className='form-control'
              type='time'
              placeholder='Enter End Time'
              name="endTime"
              value={shift.endTime}
              onChange={handleChange}
            />
          </div>
          <div className="btn-group m-4 d-flex justify-content-center" role="group" aria-label="Basic outlined example">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {errorMessage && <div className="error-message" style={{ textAlign: "center" }}>{errorMessage}</div>}
        </div>
      </div>
      <ShiftTable />
    </div>
  );
}

export default AddShift;
