import React, { useState} from 'react';
import './EmployeeRegister.css';
import axios from 'axios';
import {BsPeopleFill} from 'react-icons/bs'
import { GiArchiveRegister } from "react-icons/gi";



function EmployeeRegister() {

  
  
  const [employee, setEmployee] = useState({

    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
    status:"Active",
    role: "Employee"
  });

  
  
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message


  


  const handleChange = e => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value 
    })
  }

  const handleRegister = () => {
    const {name, email, password, reEnterPassword, role} = employee;

    
  // Validate form fields
  if (!name || !email || !password || !reEnterPassword) {
    setErrorMessage("Please fill in all fields.");
    return;

  };


    // validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if input email matches the email format
  if (!emailRegex.test(email)) {
    setErrorMessage('Please enter a valid email address.');
    return;
  }
  
    if (name && email && password && (password === reEnterPassword) && role) {
      axios.post("http://localhost:5000/EmployeeRegister", employee)
        .then(res => {
          alert(res.data.message); // Alert success message

          // Clear form fields after successful registration
          setEmployee({
            
            name:"",
            email:"",
            password:"",
            reEnterPassword:""
          })

          setErrorMessage(""); // Clear any previous error messages
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message); // Set error message
          } else {
            setErrorMessage("An unexpected error occurred."); // Set generic error message
          }
        });
    } else {
      setErrorMessage("Please ensure passwords match."); // Set validation error message
    }
  }

  return (
    <div>

      
      
    <div className='Employee-register-container'>
      <div className='employee-Register'> 
        <h3> <BsPeopleFill/> Employee Registration</h3>

        <input 
        type='text' 
        name='name' 
        value={employee.name} 
        onChange={handleChange} 
        placeholder='Enter employee Name'></input>

        <input 
        type='email' 
        name='email' 
        value={employee.email} 
        onChange={handleChange} 
        placeholder='Enter employee Email'></input> 

        <input 
        type='password' 
        name='password' 
        value={employee.password} 
        onChange={handleChange} 
        placeholder='Set Password for employee'></input>

        <input 
        type='password' 
        name='reEnterPassword' 
        value={employee.reEnterPassword} 
        onChange={handleChange} 
        placeholder='Re-enter Password'></input>

        <input 
        type='text' 
        name='role' 
        value={employee.role} 
        disabled={true}></input>
        
        <div className="btn-group mt-3" style={{width:"90%"}} role="group" aria-label="Basic outlined example">
        
        
        <button type="button" onClick={handleRegister} className="btn btn-outline-primary"><GiArchiveRegister/> Register</button>

               
        </div>

        
        
              
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      </div>
    </div>
  </div>
  );

}

export default EmployeeRegister;
