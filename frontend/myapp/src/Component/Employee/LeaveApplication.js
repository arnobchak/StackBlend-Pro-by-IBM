import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LeaveApplication.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveApplication = () => {
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [userName, setUserName] = useState('');
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
      setFormData((prevData) => ({
        ...prevData,
        applicantName: user.name,
      }));
    }
  }, []);
  

  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    leaveType: '',
    totalDays: '',
    leaveBalance: '',
    startDate: '',
    endDate: '',
    dateOfApplication:'',
    reason: '',
    remarks: '',
    status: 'Pending',
    applicantName:'',
    
  });

  useEffect(() => {
    fetchEmployees();
    fetchLeaveTypes();
    fetchLeaveApplications();
  }, []);

  useEffect(() => {
    console.log('Updated Leave Applications State:', leaveApplications);
  }, [leaveApplications]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/EmployeeAccount');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/leave-type-data');
      setLeaveTypes(response.data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const fetchLeaveApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/leave-request-data');
      setLeaveApplications(response.data);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    }
  };

  const getLatestLeaveBalance = (employeeId, leaveType) => {
    const filteredApplications = leaveApplications.filter(
      (application) =>
        application.employeeId._id === employeeId && application.leaveType._id === leaveType
    );

    if (filteredApplications.length > 0) {
      filteredApplications.sort((a, b) => new Date(b.dateOfApplication) - new Date(a.dateOfApplication));
      return filteredApplications[0].leaveBalance;
    } else {
      const selectedLeaveType = leaveTypes.find(type => type._id === leaveType);
      return selectedLeaveType ? selectedLeaveType.totalDays : null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'leaveType' || name === 'employeeId') {
      const { employeeId, leaveType } = updatedFormData;
      if (employeeId && leaveType) {
        const selectedLeaveType = leaveTypes.find(type => type._id === leaveType);
        if (selectedLeaveType) {
          const balance = getLatestLeaveBalance(employeeId, leaveType);
          const totalDays = selectedLeaveType.totalDays;
          updatedFormData = { ...updatedFormData, leaveBalance: balance, totalDays: totalDays };
        } else {
          console.log('Selected leave type not found');
        }
      }
    }

    setFormData(updatedFormData);
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;
    return differenceInDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, department, leaveType, startDate, endDate, reason, leaveBalance, dateOfApplication } = formData;

    if (!employeeId) {
      toast.error('Please select an employee');
      return;
    }
    if (!department) {
      toast.error('Please enter your department');
      return;
    }
    if (!leaveType) {
      toast.error('Please select leave type');
      return;
    }

    if (!startDate) {
      toast.error('From Date is required');
      return;
    }
 

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      toast.error ("Please enter a valid  From Date in the format DD-MM-YYYY.");
      
      return;
    };

    
    

    if (!endDate) {
      toast.error('To Date is required');
      return;
    }


    if (!dateRegex.test(endDate)) {
      toast.error ("Please enter a valid  To Date in the format DD-MM-YYYY.");
      
      return;
    };

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('To Date cannot be before From Date');
      return;
    }

    if (!reason) {
      toast.error('Please enter valid reason for the leave');
      return;
    }

    if(!dateOfApplication){
      toast.error('Please enter date of application');
      return;
    }

    if (!dateRegex.test(dateOfApplication)) {
      toast.error ("Please enter a valid  Application Date in the format DD-MM-YYYY.");
      
      return;
    };

    const today=new Date();
    const applicationDateValue=new Date(dateOfApplication)

    if (applicationDateValue>today){
      toast.error('You have entered the future date of application');
      return;
    }

  // Additional validation for leave types
  
  const selectedLeaveType = leaveTypes.find(type => type._id === leaveType);
  if (selectedLeaveType && selectedLeaveType.leaveName !== 'Sick Leave' && new Date(dateOfApplication) >= new Date(startDate)) {
    toast.error ('Date of application must be prior to the start date for leave types other than Sick Leave');
    return;
  }

  if (selectedLeaveType && selectedLeaveType.leaveName === 'Sick Leave' && new Date(dateOfApplication) < new Date(startDate)) {
    toast.error ('Date of application cannot be prior to the start date for Sick Leave');
    return;
  }
    
  
  
    
    
    const leaveDays = calculateLeaveDays(startDate, endDate);
    if (leaveBalance - leaveDays < 0) {
      toast.error('Your total leave is exhausted.');
      return;
    }

    

    try {
      const updatedFormData = {
        ...formData,
        leaveBalance: leaveBalance - leaveDays,
      };
      await axios.post('http://localhost:5000/leave-application', updatedFormData);
      alert ('Leave request submitted successfully');
      setFormData({
        employeeId: '',
        department: '',
        leaveType: '',
        totalDays: '',
        leaveBalance: '',
        startDate: '',
        endDate: '',
        dateOfApplication:'',
        reason: '',
        remarks: '',
        status: 'Pending',
        applicantName:userName,
      });
      window.location.reload(); // Refresh the page after successful submission of data.
      fetchLeaveApplications(); // Update the leave applications state
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Your earlier leave request is still pending. Failed to submit further leave request.');
    }
  };

  return (
    <div className="container container-custom mt-5">
      <h2 className="text-center form-heading">Employee Leave Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <select
            className="form-select form-select-custom"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} - {employee.email}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
        <label htmlFor="department" className="form-label">Department</label>
          <input
            type='text'
            className="form-control"
            id="department"
            name="department"
            placeholder='Enter your department'
            value={formData.department}
            onChange={handleChange}
          >
          </input>
        </div>

        <div className="mb-3">
          <select
            className="form-select form-select-custom"
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((leaveType) => (
              <option key={leaveType._id} value={leaveType._id}>
                {leaveType.leaveName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="totalDays" className="form-label">Total Leave Allotted/Year (In Days)</label>
          <input
            style={{ width: '50px', textAlign: 'center' }}
            type="text"
            className="form-control"
            id="totalDays"
            name="totalDays"
            value={formData.totalDays}
            disabled={true}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="leaveBalance" className="form-label">Leave Balance (In Days)</label>
          <input
            style={{ width: '50px', textAlign: 'center' }}
            type="text"
            className="form-control"
            id="leaveBalance"
            name="leaveBalance"
            value={formData.leaveBalance}
            disabled={true}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">From Date</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">To Date</label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reason" className="form-label">Reason</label>
          <textarea
            className="form-control"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
        <label htmlFor="dateOfApplication" className="form-label">Application Date</label>
          <input
            type='date'
            className="form-control"
            id="dateOfApplication"
            name="dateOfApplication"
            
            value={formData.dateOfApplication}
            onChange={handleChange}
          >
          </input>
        </div>
        

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LeaveApplication;
