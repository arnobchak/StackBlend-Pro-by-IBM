import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { IoMdLogIn } from "react-icons/io";
import { GiArchiveRegister } from "react-icons/gi";
import { GrUserAdmin } from "react-icons/gr";

function Register() {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
    role: "Admin",
    status:'Active'
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  
  

  const handleChange = e => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value 
    })
  }

  const handleRegister = () => {
    const { name, email, password, reEnterPassword, role} = admin;

    
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
      axios.post("http://localhost:5000/AdminRegister", admin)
        .then(res => {
          alert(res.data.message); // Alert success message
          localStorage.setItem('admin', JSON.stringify(admin)); // Store admin data in local storage
          window.location.href = "/Admin/Login";
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
    <div className='Admin-register-container'>
      <div className='admin-register'> 
        <h3> <GrUserAdmin/> Admin Registration</h3>
        <input type='text' name='name' value={admin.name} onChange={handleChange} placeholder='Enter your Name'></input>
        <input type='email' name='email' value={admin.email} onChange={handleChange} placeholder='Enter your Email'></input> 
        <input type='password' name='password' value={admin.password} onChange={handleChange} placeholder='Enter your Password'></input>
        <input type='password' name='reEnterPassword' value={admin.reEnterPassword} onChange={handleChange} placeholder='Re-enter your Password'></input>
        <input type='text' name='role' value={admin.role} disabled={true}></input>
        
        <div className="btn-group mt-3" style={{width:"90%"}} role="group" aria-label="Basic outlined example">
          <button type="button" onClick={() => window.location.href = "/admin/Login"} className="btn btn-outline-primary"> <IoMdLogIn/> Login</button>
          <button type="button" onClick={handleRegister} className="btn btn-outline-primary"> <GiArchiveRegister/> Register</button>

        </div>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      </div>
    </div>
  );
}

export default Register;
