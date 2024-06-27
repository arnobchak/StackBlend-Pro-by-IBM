import React, { useState, useEffect} from 'react';
import './ShiftSchedule.css';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';



const ShiftSchedule = () => {
  
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftSchedule, setShiftSchedule] = useState({
      employeeId: '', 
      fromDate: '',
      toDate: '',
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: ''
    
  });

  


  useEffect(() => {
        // Fetch employees and shifts data when the component mounts
        fetchEmployees();
        fetchShifts();
    
    }, []);
  

   // Function to fetch employees data
   const fetchEmployees = async () => {
    try {
        const response = await fetch('http://localhost:5000/EmployeeAccount'); // Endpoint to fetch employees
        const employeesData = await response.json();

        // Filter out inactive users
      const activeEmployees = employeesData.filter(employee => employee.status === "Active");
        setEmployees(activeEmployees);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
};

// Function to fetch shifts data
const fetchShifts = async () => {
  try {
      const response = await fetch('http://localhost:5000/GetAllShiftData'); // Endpoint to fetch shifts
      const shiftsData = await response.json();

      // Filter out inactive shifts
      const activeShifts = shiftsData.filter(shift => shift.status === "Active");

      setShifts(activeShifts);
  } catch (error) {
      console.error('Error fetching shifts:', error);
  }
};




// Function to handle form field changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setShiftSchedule({ ...shiftSchedule, [name]: value });
};


const handleSubmit = (e) => {
  e.preventDefault();
  const { employeeId, fromDate, toDate, sun, mon, tue, wed, thu, fri, sat } = shiftSchedule;

  // Check if employeeId is selected
  if (!employeeId) {
    toast.error("Please select an employee.");
    return;
  }

  if (!fromDate){
    toast.error("Please enter From Date.");
    return;

  }

  // Validate fromDate 

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(fromDate)) {
    toast.error("Please enter valid From Date in the format DD-MM-YYYY.");
    return;
  };

  const today = new Date();
  const fromDateValue = new Date(fromDate);

  if (fromDateValue > today) {
    toast.error("From date cannot be in the future.");
    return; 
  };

  if (!toDate){
    toast.error("Please enter To Date.");
    return;

  }

  // validate toDate
  if (!dateRegex.test(toDate)) {
    toast.error("Please enter valid To Date in the format DD-MM-YYYY.");
    return;
  };

  const toDateValue = new Date(toDate);
  if (toDateValue>today) {
    toast.error("To Date cannot be in the future.");
    return;
  };

  if (toDateValue < fromDateValue) {
    toast.error("To Date value cannot be prior to From Date.");
    return;
  };


  // Check if shifts are selected for at least six days
  const selectedShifts = [sun, mon, tue, wed, thu, fri, sat];
  const selectedShiftCount = selectedShifts.filter(shift => shift !== '').length;
  if (selectedShiftCount < 6) {
    toast.error("Please select shifts for exactly six days.");
    return;
  }
  
   


  // Check if any of the shift values for the seven days is left blank
  const shiftsValues = [sun, mon, tue, wed, thu, fri, sat];
  if (shiftsValues.some(shift => shift === '')) {
    // Set default value for the empty shifts
    const defaultShift = 'Off'; // One can set any default value here
    const updatedShiftSchedule = {
      ...shiftSchedule,
      sun: sun || defaultShift,
      mon: mon || defaultShift,
      tue: tue || defaultShift,
      wed: wed || defaultShift,
      thu: thu || defaultShift,
      fri: fri || defaultShift,
      sat: sat || defaultShift
    };
    setShiftSchedule(updatedShiftSchedule);

    
  }

// Submit the form data
  submitFormData();
};

const submitFormData = () => {
  axios.post('http://localhost:5000/AddShiftSchedule', shiftSchedule)
    .then((response) => {
      alert(response.data.message);
      // Reset form fields
      setShiftSchedule({
        employeeId: '',
        fromDate: '',
        toDate: '',
        sun: '',
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: ''
      });
      
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    });
};



// Function to count selected days
const countFilledInputs= () => {
  let count = 0;
  for (const key in shiftSchedule) {
    if (shiftSchedule[key]) count++;
  }
  return count;
};

// Function to disable input for a day if six days are selected
const shouldDisableDay = (day) => {
  return countFilledInputs() >= 9 && !shiftSchedule[day];
};






  return (
    <div>
      <div className="shiftScheduleFormBody">
        <div className='shiftScheduleFormBorder'>

          <div id="shiftScheduleFormHeading">
            <h3>Shift Schedule Form</h3>

          </div>

          <div className='shiftScheduleFormInput'>

            <div id="formEmployeeIdInput">
              <select  id="employeeId" name="employeeId" value={shiftSchedule.employeeId} onChange={handleInputChange} >
                <option value="">Select Employee</option>
                {/* Populate options dynamically from User table*/}
                {employees.map(employee => (
                <option key={employee._id} value={employee._id}>{employee.name}-{employee.email}</option>
                ))}
              </select>

            </div>

            <div className='formDateRangeInput'>
            <label htmlFor="fromDate">From Date:</label>
              <input type="date" id="fromDate" name="fromDate" value={shiftSchedule.fromDate} onChange={handleInputChange}></input>
              <label htmlFor="toDate">To Date:</label>
              <input type="date" id="toDate" name="toDate" value={shiftSchedule.toDate} onChange={handleInputChange}></input>

            </div>

          </div>
          <div><p style={{textAlign:'center', fontSize:'25px', color:'blue'}}>Select shift for any six days</p></div>
          
          <div className="scheduleFormShiftInput">
            {/* Day selection inputs */}
            
            
            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
              <div className="shiftScheduleFormDayColumn" key={day}>
                <label htmlFor={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                <select
                  id={day}
                  name={day}
                  value={shiftSchedule[day]}
                  onChange={handleInputChange}
                  disabled={shouldDisableDay(day)}
                >
                  <option value="">Select Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift._id} value={shift._id}>
                      {shift.shiftName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="btn-group m-4 d-flex justify-content-center" role="group" aria-label="Basic outlined example">
            
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
          
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ShiftSchedule;
