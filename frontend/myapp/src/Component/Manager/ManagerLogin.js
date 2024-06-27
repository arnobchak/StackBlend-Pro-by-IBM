import React, { useState } from "react";
import "./ManagerLogin.css" ;
import axios from "axios";
import { useNavigate } from "react-router-dom"; //Import useNavigate hook
import 'bootstrap/dist/css/bootstrap.min.css';
import { FcManager } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { IoMdLogIn } from "react-icons/io";




function ManagerLogin({onLogin}) {

  const [user, setUser] = useState({
    email: "",
    password: "",
    status:"Active"
  
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
    axios.post("http://localhost:5000/ManagerLogin", user)
      .then(res => {
        const {message, name} = res.data;

        alert(message); 
        localStorage.setItem('user',JSON.stringify({name}));
        setErrorMessage(""); 
        onLogin(name); // Pass the user's name to onLogin 
        navigate('/managerDashboard'); // Redirect to Manager Dashboard page upon successful login
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
  
      

       
  
    <div className='Manager-login-container'>
      
      <div className="Login">
        <h2 style={{marginBottom:"20px"}}><FcManager/> Manager Login</h2>
        <div className="form-floating mb-3 ">
          <input type="email" name="email" value={user.email} onChange={handleChange} className ="form-control" id="floatingInput"placeholder="name@example.com"/>
          <label for="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
        <input type="password" name="password" value={user.password} onChange={handleChange} className="form-control" id="floatingPassword" placeholder="Password"/>
        <label for="floatingPassword">Password</label>
        </div>
        <div className="form-floating mt-2 ">
        <a style={{fontWeight:'bold', textDecoration:'none'}}href="/Email-Js">Forget Password?</a>
        </div>

        <div className="btn-group mt-5" style={{width:"100%"}} role="group" aria-label="Basic outlined example">
        <button type="button" onClick={() => navigate('/')} className="btn btn-outline-primary"> <FcHome/> Home</button>{/* Use navigate for redirection */}

        <button type="button" onClick={handleLogin} className="btn btn-outline-primary"><IoMdLogIn/> Login</button>

        </div>
        <br/>
        <br/>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
    
    </div>
  );
}

export default ManagerLogin;
