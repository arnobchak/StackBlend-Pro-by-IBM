import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./ForgotPassword.css";
import { IoMdLogIn } from "react-icons/io";
import { MdLockReset } from "react-icons/md";

const ForgotPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate(); // Use useNavigate hook to get the navigation function
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const userValid = async () => {
    try {
      const response = await fetch(`http://localhost:5000/forgot-password/${id}/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (data.status === 201) { 
        // Check response status instead of data
        console.log("User valid");
      } else {
        navigate("/"); // Redirect to Home page if user is not valid
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error("Failed to verify user");
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/${id}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (response.status === 201) { 
        // Check response status instead of data
        setPassword("");
        setMessage(true);
      } else {
        toast.error("Token expired, Generate new Link.");
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error("Failed to reset password");
    }
  };

  useEffect(() => {
    userValid();
  }, []);

  return (
    <div>
      <div className='forgot-password-container'>
        <div className="forgot-password">
          {message ? (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Password Reset Successful!</h2>
              <p>Your password has been successfully reset.</p>
              <a style={{ textDecoration: "none", color: "gray", fontWeight: 'bold' }} href="/Admin/Login"><IoMdLogIn/> Login</a>
            </div>
          ) : (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Enter your new password</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="form-control"
                    id="floatingInput"
                    placeholder="Enter your new password"
                  />
                  <label htmlFor="floatingInput"> Enter new password here</label>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <MdLockReset/>
                Reset</button>
              </form>
              <br />
              <br />
              <a style={{ textDecoration: "none", color: "black", fontWeight: 'bold' }} href="/Admin/Login"><IoMdLogIn/> Login</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default ForgotPassword;
