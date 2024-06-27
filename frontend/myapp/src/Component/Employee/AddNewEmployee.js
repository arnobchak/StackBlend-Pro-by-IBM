import React, { useState, useEffect} from 'react';
import './AddNewEmployee.css'
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';






const AddNewEmployee = () => {
  
  
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
      
      empName: '',
      empEmail: '',
      empDepartment: '',
      empMobile: '',
      empDob: '',
      empDoj: '',

    
  });

  useEffect(() => {
    // Fetch employee account data when the component mounts
    fetchEmployeeAccountData();
    
    }, []);


   // Function to fetch employee account data
   const fetchEmployeeAccountData = async () => {
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

// Function to handle form field changes
const handleInputChange = (e) => {
  setEmployee({ ...employee, [e.target.name]: e.target.value });
  
};
  
  
  
const handleSubmit = (e) => {
    e.preventDefault();

    const { empDepartmemt, empName, empEmail,empMobile, empDob, empDoj } = employee;
  
    
  // Validation
    if (!empName){
      toast.error("Please select  name.");
      return;
    }

    if (!empDepartmemt){
      toast.error("Please enter employee department.");
      return;
    }

    if(!empEmail){
      toast.error("Please select email.");
      return;
    }

    if(!empMobile){
      toast.error("Please enter employee mobile.");
      return;
    }
  

    // Validate mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(empMobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    };

    if(!empDob){
      toast.error("Please enter employee date of birth.");
      return;
    }

    
  
    // Validate date of birth 
  
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(empDob)) {
      toast.error("Please enter a valid date of birth in the format DD-MM-YYYY.");
      return;
    };
  
    const today = new Date();
    const dobValue = new Date(empDob);
  
    if (dobValue > today) {
      toast.error("Date of birth cannot be in the future.");
      return; 
    };

    if(!empDoj){
      toast.error("Please enter employee Date of Joining.");
      return;
    }
  
    // validate date of joining
    if (!dateRegex.test(empDoj)) {
      toast.error("Please enter a valid date of joining in the format DD-MM-YYYY.");
      return;
    };
  
    const dojValue = new Date(empDoj);
    if (dojValue>today) {
      toast.error("Date of joining cannot be in the future.");
      return;
    };
  
    if (dojValue <= dobValue) {
      toast.error("Date of joining  cannot be prior to or equal to the date of birth.");
      return;
    };

    // Check the difference between empDob and empDoj is at least 18 years
    const diffYears = dojValue.getFullYear() - dobValue.getFullYear();
    const diffMonths = dojValue.getMonth() - dobValue.getMonth();
    const diffDays = dojValue.getDate() - dobValue.getDate();

    if (
      diffYears < 18 ||
      (diffYears === 18 && diffMonths < 0) ||
      (diffYears === 18 && diffMonths === 0 && diffDays < 0)
    ) {
      toast.error("The difference between Date of Birth and Date of Joining must be at least 18 years.");
      return;
    }
  
  
  
    // Check whether name and email match
    if(empName !== empEmail) {
      toast.error("Name and email do not match.");
      return
    }
  
    // If all validations pass, proceed with form submission
    if ( empDepartmemt && empName === empEmail && empMobile && empDob && empDoj) {
      
      
      
      axios.post('http://localhost:5000/AddEmployee', employee)
        .then((response) => {
          alert(response.data.message);

          // Reset form fields
          setEmployee({
            empDepartment: '',
            empName:'',
            empEmail:'', 
            empMobile:'',
            empDob:'',
            empDoj:''

            
          });

          window.location.reload(); //Refresh the page
          
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An unexpected error occurred.");
          }
        });
    }
  };
  
  
 


  

  return (
    <div>
      <div className="editMyProfileFormBody">
        <div className='editMyProfileFormBorder'>

          <div id="editMyProfileFormHeading">
            <h3>Add Employee Details</h3>
          
          </div>

          <div className='formInput'>

            <div id="editMyProfileInput">

              <select  id="empName" name="empName" value={employee.empName} onChange={handleInputChange} >
                <option value="">Select Name</option>
                {/* Populate options dynamically from Employee table*/}
                {employees.map(employee => (
                <option key={employee._id} value={employee._id}>{employee.name} - {employee.email}</option>
                ))}
              </select>

              <select  id="empEmail" name="empEmail" value={employee.empEmail} onChange={handleInputChange} >
                <option value="">Select Email</option>
                {/* Populate options dynamically from Employee table*/}
                {employees.map(employee => (
                <option key={employee._id} value={employee._id}>{employee.email}</option>
                ))}
              </select>

              <label htmlFor='empDepartment'>Emp Department:</label>
              <input type='text' id="empDepartment" name="empDepartment" value={employee.empDepartment} 
              placeholder='Enter employee department'onChange={handleInputChange}></input>

              <label htmlFor="mob">Mobile:</label>
              <input type='phone' id="mob" name="empMobile" value={employee.empMobile} onChange={handleInputChange} 
              placeholder='Enter 10-digit Mobile number'></input>

              <label htmlFor='dob'>Date of Birth:</label>
              <input type='date' id="dob" name="empDob" value={employee.empDob} onChange={handleInputChange}></input>

              <label htmlFor='doj'>Date of Joining:</label>
              <input type='date' id="doj" name="empDoj" value={employee.empDoj} onChange={handleInputChange}></input>




            </div>

              




      
          </div>

           
            
            <div  className="btn-group m-4 d-flex justify-content-center" role="group" aria-label="Basic outlined example">
      
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
                
        </div>
      </div>
      <ToastContainer/>
      
    </div>
  )
}

export default AddNewEmployee;
