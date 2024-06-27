import React, { useState, useEffect } from 'react';
import './EditMyProfile.css';
import axios from 'axios';
import { FcManager } from "react-icons/fc";
import { ToastContainer, toast } from 'react-toastify';

const EditMyProfile = () => {
  const [userName, setUserName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [manager, setManager] = useState({
    mgrName: '',
    mgrEmail: '',
    mgrMobile: '',
    mgrDob: '',
    mgrDoj: '',
  });

  useEffect(() => {
    // Code to display the user name as per logged in credential
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      fetchManagerAccountData();
    }
  }, [userName]);

  const fetchManagerAccountData = async () => {
    try {
      const response = await fetch('http://localhost:5000/ManagerAccount'); // Endpoint to fetch account data
      const employeesData = await response.json();
      // Filter out inactive users
      const activeEmployees = employeesData.filter(employee => employee.status === "Active");

      // Find the manager whose name matches the logged-in user's name
      const loggedInManager = activeEmployees.find(employee => employee.name === userName);
      if (loggedInManager) {
        setManager({
          mgrName: loggedInManager.name,
          mgrEmail: loggedInManager.email,
          
        });
      }

      setEmployees(activeEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    setManager({ ...manager, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { mgrName, mgrEmail, mgrMobile, mgrDob, mgrDoj } = manager;


    // Validate mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mgrMobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate date of birth
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(mgrDob)) {
      toast.error("Please enter a valid date of birth in the format YYYY-MM-DD.");
      return;
    }

    const today = new Date();
    const dobValue = new Date(mgrDob);
    if (dobValue > today) {
      toast.error("Date of birth cannot be in the future.");
      return;
    }

    // Validate date of joining
    if (!dateRegex.test(mgrDoj)) {
      toast.error("Please enter a valid date of joining in the format YYYY-MM-DD.");
      return;
    }

    const dojValue = new Date(mgrDoj);
    if (dojValue > today) {
      toast.error("Date of joining cannot be in the future.");
      return;
    }

    if (dojValue <= dobValue) {
      toast.error("Date of joining cannot be prior to or equal to the date of birth.");
      return;
    }

  

    // Check the difference between mgrDob and mgrDoj is at least 18 years
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

    // If all validations pass, proceed with form submission
    if (mgrName && mgrEmail && mgrMobile && mgrDob && mgrDoj) {
      axios.post('http://localhost:5000/AddManagerProfile', manager)
        .then((response) => {
          alert(response.data.message);

          // Reset form fields
          setManager({
            mgrMobile: '',
            mgrDob: '',
            mgrDoj: '',
          });
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
            <FcManager style={{ fontSize: '50px' }} />
            <h3>Manager Profile</h3>
            <p>{userName}</p>
          </div>
          <div className='formInput'>
            <div id="editMyProfileInput">
              <label htmlFor="empName"> Manager Name:</label>
              <input
                type="text"
                id="empName"
                name="mgrName"
                value={manager.mgrName}
                onChange={handleInputChange}
                readOnly
              />

              <label htmlFor="empEmail">Email:</label>
              <input
                type="email"
                id="empEmail"
                name="mgrEmail"
                value={manager.mgrEmail}
                onChange={handleInputChange}
                readOnly
              />

              <label htmlFor="mob">Mobile:</label>
              <input
                type='phone'
                id="mob"
                name="mgrMobile"
                value={manager.mgrMobile}
                onChange={handleInputChange}
                placeholder='Enter 10-digit Mobile number'
              />

              <label htmlFor='dob'>Date of Birth:</label>
              <input
                type='date'
                id="dob"
                name="mgrDob"
                value={manager.mgrDob}
                onChange={handleInputChange}
              />

              <label htmlFor='doj'>Date of Joining:</label>
              <input
                type='date'
                id="doj"
                name="mgrDoj"
                value={manager.mgrDoj}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="btn-group m-4 d-flex justify-content-center" role="group" aria-label="Basic outlined example">
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default EditMyProfile;
