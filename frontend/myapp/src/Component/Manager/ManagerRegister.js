import React, { useState} from 'react';
import './ManagerRegister.css';
import axios from 'axios';
import { GrUserManager } from "react-icons/gr";
import { GiArchiveRegister } from "react-icons/gi";




function ManagerRegister() {

  
  const [manager, setManager] = useState({

    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
    status:"Active",
    role: "Manager"
  });

 

  
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const handleChange = e => {
    const { name, value } = e.target;
    setManager({
      ...manager,
      [name]: value 
    })
  }

  const handleRegister = () => {
    const {name, email, password, reEnterPassword, role} = manager;

    
  // Validate form fields
  if (!name || !email || !password || !reEnterPassword ) {
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
      axios.post("http://localhost:5000/ManagerRegister", manager)
        .then(res => {
          alert(res.data.message); // Alert success message

          // Clear form fields after successful registration
          setManager({
            
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
      
    
    <div className='containerManagerRegister'>
      
      
      <div className='manager-register'> 
        <h3> <GrUserManager/> Manager Registration</h3>
        <input 
        type='text' 
        name='name' 
        value={manager.name} 
        onChange={handleChange} 
        placeholder='Enter manager Name'></input>

        <input 
        type='email' 
        name='email' 
        value={manager.email} 
        onChange={handleChange} 
        placeholder='Enter manager Email'></input> 

        <input 
        type='password' 
        name='password' 
        value={manager.password} 
        onChange={handleChange} 
        placeholder='Set Password for manager'></input>

        <input 
        type='password' 
        name='reEnterPassword' 
        value={manager.reEnterPassword} 
        onChange={handleChange} 
        placeholder='Re-enter Password'></input>

        <input 
        type='text' 
        name='role' 
        value={manager.role} 
        disabled={true}></input>


        
        <div className="btn-group mt-3" style={{width:"90%"}} role="group" aria-label="Basic outlined example">

        
        

        <button type="button" onClick={handleRegister} className="btn btn-outline-primary"> <GiArchiveRegister/> Register</button>

               
        </div>

        
        
              
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
      </div>
    </div>
  </div>
  );
}

export default ManagerRegister;
