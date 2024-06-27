import React, { useState, useEffect} from 'react';
import './ShiftSwapForm.css'
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';





function ShiftSwapForm() {
  
  
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftSwap, setShiftSwap] = useState({

    employeeId: '', 
    originalDate: '',
    originalShift: '', 
    requestedDate: '', 
    requestedShift: '', 
    reason: '', 
    submissionDate:'', 
    requestorEmail:'', 
    counterPartEmail:'', 
    notes:'', 
    status:'Pending',

    
  });



  useEffect(() => {
    // Fetch manager account data when the component mounts
    fetchEmployees();
    fetchShifts();
    
    
  
    

  },[]);

  const fetchEmployees = async () => {
    try {
        const response = await fetch('http://localhost:5000/EmployeeAccount'); // Endpoint to fetch account data
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

const handleInputChange = (e) => {
  const { name, value } = e.target;

  // If the input name is 'originalDate' or 'requestedDate'
  if (name === "originalDate" || name === "requestedDate") {
    const selectedDate = new Date(value);
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDate.getDay()];
    
    // If the input name is 'originalDate'
    if (name === "originalDate") {
      setShiftSwap({
        ...shiftSwap,
        [name]: value,
        [`${name}Weekday`]: weekday,
        // Update requestedDate with the same value as originalDate
        requestedDate: value,
      });
    } else {
      // For 'requestedDate' update normally
      setShiftSwap({
        ...shiftSwap,
        [name]: value,
        [`${name}Weekday`]: weekday,
      });
    }
  } else if (name === "employeeId") {
    // If the input name is 'employeeId' (requestor's name)
    const selectedEmployee = employees.find((employee) => employee._id === value);
    // If an employee is found, set their email as the requestor email
    if (selectedEmployee) {
      setShiftSwap({
        ...shiftSwap,
        [name]: value,
        requestorEmail: selectedEmployee._id, // Automatically set requestor email
      });
    }
  } else {
    // For other input fields, update normally
    setShiftSwap({ ...shiftSwap, [name]: value });
  }
};


const handleSubmit = (e) => {
  e.preventDefault();
  const { employeeId,originalDate,originalShift,requestedShift, reason, submissionDate, requestorEmail,counterPartEmail, 
  } = shiftSwap;

  
   // Check if employeeId is selected
   if (!employeeId) {
    toast.error("Please select requestor name.");
    
    return;
  }

  // Check if original date is selected
  if (!originalDate) {
    toast.error("Please enter original date of shift.");
    
    return;
  }


  // Validate original date

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(originalDate)) {
    toast.error("Please enter a valid  original date in the format DD-MM-YYYY.");
    
    return;
  };

  const today=new Date();
  const oDateValue = new Date(originalDate);
  if (oDateValue <= today) {
    toast.error("Original date cannot be in the past or today.");
    
    return;
  }

  if (!originalShift){
    toast.error('Please select original shift.');
    
    return;
  };

 
  if (!requestedShift){
    toast.error ("Please select  requested shift as per your choice.");
    
    return;
  };


  if (originalShift===requestedShift){
    toast.error ("Original shift and requested shift must be different.");
    
    return;

  };

  if (!reason){
    toast.error ("Please indicate reason which is mandatory.");
  
    return;
  };


  if (!submissionDate){
    toast.error ("Please enter date of submission.");
    

    return;
  };

  if (!dateRegex.test(submissionDate)) {
    toast.error("Please enter a valid date of submission in the format DD-MM-YYYY.");
    
    return;
  };

  const dateOfSubmissionValue=new Date (submissionDate)

  if (dateOfSubmissionValue>today){
    toast.error("Date of submission cannot be in the future.");
    
    return;
  }




  // Check if submission date is at least 15 days prior to original date
  const originalDateValue = new Date(originalDate);
  const submissionDateValue = new Date(submissionDate);

  // Calculate the difference in milliseconds
  const differenceInTime = originalDateValue.getTime() - submissionDateValue.getTime();
  // Calculate the difference in days
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  if (differenceInDays < 15) {
    toast.error("Submission date must be at least 15 days prior to the original date.");
    
    return;
  };



  if (!counterPartEmail){
    toast.error ("Please select counter-part email.");
    
    return;
  };

  if (requestorEmail===counterPartEmail){
    toast.error ("Requestor and counter-part email must be different.");
    
    return;
  };

  
  
  
  // Submit the form data
  submitFormData();
};

const submitFormData = () => {
  axios.post('http://localhost:5000/AddShiftSwap', shiftSwap)
    .then((response) => {
      alert(response.data.message);
      // Reset form fields
      setShiftSwap({
        employeeId: '', 
        originalDate: '',
        originalDateWeekday:'',
        originalShift: '', 
        requestedDate: '', 
        requestedShift: '', 
        reason: '', 
        submissionDate:'', 
        requestorEmail:'', 
        counterPartEmail:'', 
        notes:''
    

      });
    
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error ("An unexpected error occurred.");
      }
    });
};



  


  return (
    <div className="container-fluid mt-4 mb-3">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="sw-card" style={{backgroundColor:'white'}}>
            <div className="card-header" >
              <h2 className="text-center">Shift Swap Form</h2>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group">
                <select
                  className="form-control"
                  id="requestorName"
                  name="employeeId"
                  value={shiftSwap.employeeId}
                  onChange={handleInputChange}
                >
                  <option value="" style={{ color: "#007bff" }}>
                    Select requestor Name
                  </option>
                  {/* Populate options dynamically from User table*/}
                    {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                    {employee.name}-{employee.email}
                  </option>
                    ))}
                </select>
                </div>


                <div className="border p-3 mt-3" style={{ borderColor: "#28a745" }}>
                  <p className='text-center' style={{ fontSize: "15px", fontWeight: "bold", color: "#28a745" }}>Original Shift Details</p>
                  <div className="form-group">
                    <label htmlFor="originalDate" style={{ color: "#28a745" }}> Original Shift Date:</label>
                    <input type="date" className="form-control" id="originalDate" name="originalDate" value={shiftSwap.originalDate} onChange={handleInputChange}></input>
                  </div>

                  <div className='form-group mt-3'>
                    
                    <input type='text' className='form-control' placeholder='Day'  value={shiftSwap.originalDateWeekday}disabled={true}></input>

                  </div>




                  <div className="form-group mt-3">
                    <select className="form-control" id="originalShift" style={{ color: "#28a745" }} name="originalShift" value={shiftSwap.originalShift} onChange={handleInputChange}>
                      <option value="" style={{ color: "#28a745" }}>Select original Shift</option>
                      {/* Populate options dynamically from Shift table*/}
                      {shifts.map (val=>(
                        <option key={val._id} value={val._id}>{val.shiftName}</option>
                      ))}
                      
                    </select>
                  </div>

                </div>

                <div className="border p-3 mt-3" style={{ borderColor: "#dc3545" }}>
                  <p className='text-center' style={{ fontSize: "15px", fontWeight: "bold", color: "#dc3545" }}>Requested Shift Details</p>
                  <div className="form-group">
                    <label htmlFor="requestedDate" style={{ color: "#dc3545" }}> Request Date:</label>
                    <input type="date" className="form-control" id="requestedDate" name="requestedDate" value={shiftSwap.requestedDate} onChange={handleInputChange} disabled={true}></input>
                  </div>

                  <div className='form-group mt-3'>
                    
                    <input type='text' className='form-control' placeholder='Day'  value={shiftSwap.originalDateWeekday}disabled={true}></input>

                  </div>





                  <div className="form-group mt-3">
                    <select className="form-control" id="requestedShift" style={{ color: "#dc3545" }}name="requestedShift" value={shiftSwap.requestedShift} onChange={handleInputChange}>
                      <option value="" style={{ color: "#dc3545" }}>Select requested Shift</option>
                      {/* Populate options dynamically from Shift table*/}
                      {shifts.map (val=>(
                        <option key={val._id} value={val._id}>{val.shiftName}</option>
                      ))}
                    </select>
                  </div>
                </div>



                <div className="form-group mt-3">
                  <label htmlFor="reason">Reason for Request:</label>
                  <textarea className="form-control" placeholder="Mandatory" id="reason" rows="3" name="reason" value={shiftSwap.reason} onChange={handleInputChange}></textarea>
                </div>


                <div className="form-group mt-3">
                  <label htmlFor="submissionDate">Date of Submission:</label>
                  <input type="date" className="form-control" id="submissionDate" name="submissionDate" value={shiftSwap.submissionDate} onChange={handleInputChange}></input>
                </div>

                <div className="form-group mt-3">
                <select className="form-control" id="requestorEmail" name="requestorEmail" value={shiftSwap.requestorEmail} onChange={handleInputChange} disabled={true}>
                  <option value="" style={{ color: "#ffc107" }}>Select email of requestor</option>
                    {/* Populate options dynamically from User table*/}
                    {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                    {employee.email}
                  </option>
                  ))}
                </select>
                </div>

                <div className="form-group mt-3">
                  <select className="form-control" id="counterPartEmail" name="counterPartEmail" value={shiftSwap.counterPartEmail} onChange={handleInputChange}>
                    <option value="" style={{ color: "#17a2b8" }}>Select email of counter-part</option>
                    {/* Populate options dynamically from user table*/}
                    {employees.map(employee => (
                    <option key={employee._id} value={employee._id}>{employee.email}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="notes">Notes:</label>
                  <textarea className="form-control" placeholder ="Optional" id="notes" rows="3" name="notes" value = {shiftSwap.notes} onChange={handleInputChange}></textarea>
                </div>

                <button type="submit" className="btn btn-primary mt-3 " onClick={handleSubmit}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default ShiftSwapForm;
