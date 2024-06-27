import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./LeaveType.css"


const LeaveType = () => {
  const [leaveType, setLeaveType] = useState({
    leaveName: '',
    description: '',
    totalDays: '',
    status: 'In-Active',
  });

  const onInput = (e) => {
    setLeaveType({ ...leaveType, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType.leaveName) {
      toast.error('Please select leave name.');
      return;
    }

    if (!leaveType.description) {
      toast.error('Please enter details about leave as per your company rule.');
      return;
    }

    if (!leaveType.totalDays) {
      toast.error('Please enter number of days allotted.');
      return;
    }

    if (leaveType.totalDays <= 0) {
      toast.error('Please enter a positive number.');
      return;
    }

    try {
      await axios.post("http://localhost:5000/leave-type", leaveType);
      toast.success('Data saved successfully');
      setLeaveType({
        leaveName: "",
        description: "",
        totalDays: "",
        status: 'In-Active',
      });
    } catch (error) {
      
      console.error('Error saving record:', error);
      toast.error('Data already exists.');
    }
  };

  return (
    <div>
      
      <div className='addShiftContainer'>
        <div className='addShiftFormBox'>
          <div>
            <h4 id="addShiftFormHeading">Add Leave Details</h4>
          </div>
          <div className='addShiftDiv'>
            <select
              className="form-select"
              name="leaveName"
              value={leaveType.leaveName}
              onChange={onInput}>
              <option value="">Select Leave Name</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Public Holidays">Public Holidays</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
            </select>
          </div>
          <div className='addShiftDiv'>
            <label className='inputNewEmployeeLabel'>Description</label>
            <input
              className='form-control'
              type='text'
              placeholder='Write details about leave'
              name="description"
              value={leaveType.description}
              onChange={onInput}
            />
          </div>
          <div className='addShiftDiv'>
            <label className='inputNewEmployeeLabel'>No of days allotted</label>
            <input
              className='form-control'
              type='number'
              name="totalDays"
              value={leaveType.totalDays}
              onChange={onInput}
            />
          </div>
          <div className="btn-group m-4 d-flex justify-content-center" role="group" aria-label="Basic outlined example">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LeaveType;
