import React, { useState } from "react";
import "./Login.css" ;
import axios from "axios";
import { useNavigate } from "react-router-dom"; //Import useNavigate hook
import 'bootstrap/dist/css/bootstrap.min.css';
import { GrUserAdmin } from "react-icons/gr";
import { FaHome } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { GiArchiveRegister } from "react-icons/gi";







function Login({onLogin}) {

  

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();//Initialize navigate from useNavigate hook


  const handleChange = e => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };


  const handleLogin = () => {
    axios.post("http://localhost:5000/Login", user)
      .then(res => {
        const {message, name} = res.data;

        alert(message); 
        localStorage.setItem('user',JSON.stringify({name}));
        setErrorMessage(""); 
        onLogin(name); // Pass the user's name to onLogin 
        navigate('/adminDashboard'); // Redirect to home page upon successful login
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message); 
        } else {
          setErrorMessage("An unexpected error occurred."); 
        }
      });
  };

 
  
  
  

  return (
    <div >
  
      <div className='Admin-login-container'>
      
      <div className="Login">
        <h2 style={{marginBottom:"20px"}}><GrUserAdmin/> Admin Login</h2>
        <div className="form-floating mb-3 ">
          <input type="email" name="email" value={user.email} onChange={handleChange} className ="form-control" id="floatingInput"placeholder="name@example.com"/>
          <label for="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
        <input type="password" name="password" value={user.password} onChange={handleChange} className="form-control" id="floatingPassword" placeholder="Password"/>
        <label for="floatingPassword">Password</label>
        </div>
        <div className="form-floating mt-2 ">
        <a style={{fontWeight:'bold', textDecoration:'none'}}href="/password-reset">Forget Password?</a>
        </div>
        

        <div className="btn-group mt-5" style={{width:"100%"}} role="group" aria-label="Basic outlined example">
        <button 
        type="button" 
        onClick={handleLogin} 
        className="btn btn-outline-primary"
        >
        <IoMdLogIn/> 
        Login</button>

        
        
        <button 
        type="button" 
        onClick={() => navigate('/Admin/Register')} 
        className="btn btn-outline-primary">
        <GiArchiveRegister/>
        Register</button>{/* Use navigate for redirection */}
        </div>
        <br/>
        <br/>
        
        <a style={{textDecoration: "none", color: "black", fontSize:'20px', fontWeight:'bold'}} href="/"><FaHome/> Back to Home</a>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
    
    </div>
  );
}

export default Login;
