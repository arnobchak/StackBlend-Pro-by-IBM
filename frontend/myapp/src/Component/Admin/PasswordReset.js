import React, { useState } from 'react';
import './PasswordReset.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdLockReset } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const inputChange = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/sendPasswordLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to send password reset link');
      }
  
      const data = await res.json();
      console.log('Response from server:', data); // Log the response
  
      if (res.status === 201) {
        setEmail('');
        setMessage('Password reset link sent successfully to your email address.');
        toast.success('Password reset link sent successfully');
      } else if (res.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Invalid User');
      }
    } catch (error) {
      console.error('Error sending password reset link:', error);
      toast.error('Failed to send password reset link');
    }
  };
  
  return (
    <div>
      <div className="password-reset-container">
        <div className="reset">
          <h2 style={{ marginBottom: '20px' }}><MdLockReset/> Reset Password</h2>

          {message && (
            <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
          )}

          <div className="form-floating mb-4">
            <input
              type="email"
              name="email"
              value={email}
              onChange={inputChange}
              className="form-control"
              id="floatingInput"
              placeholder="Enter Email"
            />
            <label htmlFor="floatingInput"> Enter email here</label>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={sendLink}
            style={{ width: '100%', fontSize:'20px' }}
          >
            <MdEmail/>
            Send
          </button>

          <br />
          <br />

          <a
            style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}
            href="/Admin/Login"
          >
            <AiOutlineLogin/> Login
          </a>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PasswordReset;
