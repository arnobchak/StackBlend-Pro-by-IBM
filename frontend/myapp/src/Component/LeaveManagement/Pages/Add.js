import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {

  const [employee, setEmployee] = useState([]);
  const [leave, setLeave] = useState([]);
  const [originalTotalDays, setOriginalTotalDays] = useState(0); // To store original total leave days
  const [emp, setEmp] = useState({
    empName: '',
    department: '',
    leaveType: '',
    totalDays: '',
    leaveBalance: '', // To store the remaining leave balance
    fromDate: '',
    toDate:'',
    reason: ''
  });

  useEffect(() => {
    fetchEmployeeAccountData();
    fetchLeaveTypeData();

  }, []);

  const fetchEmployeeAccountData = async () => {
    try {
      const response = await fetch('http://localhost:5000/EmployeeAccount');
      const employeesData = await response.json();
      const activeEmployees = employeesData.filter(employee => employee.status === "Active");
      setEmployee(activeEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLeaveTypeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/leave-type-data');
      const leaveTypeData = await response.json();
      const activeLeaveType = leaveTypeData.filter(leave => leave.status === "Active");
      setLeave(activeLeaveType);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const fetchLeaveBalance = async (empName, leaveType) => {
    try {
      const response = await axios.get(`http://localhost:5000/leave-balance/${empName}/${leaveType}`);
      return response.data.leaveBalance;
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      return 0;
    }
  };

  const onInput = async (e) => {
    const { name, value } = e.target;
    if (name === 'leaveType' || name === 'empName') {
      const updatedEmp = { ...emp, [name]: value };
      if (updatedEmp.empName && updatedEmp.leaveType) {
        const leaveBalance = await fetchLeaveBalance(updatedEmp.empName, updatedEmp.leaveType);
        const selectedLeaveType = leave.find(leaveType => leaveType._id === updatedEmp.leaveType);
        const totalDays = selectedLeaveType ? selectedLeaveType.totalDays : '';
        setEmp({ ...updatedEmp, totalDays, leaveBalance });
        setOriginalTotalDays(totalDays);
      } else {
        setEmp(updatedEmp);
      }
    } else if (name === 'fromDate' || name === 'toDate') {
      const updatedEmp = { ...emp, [name]: value };
      setEmp(updatedEmp);
      if (updatedEmp.fromDate && updatedEmp.toDate) {
        const leaveDays = calculateLeaveDays(updatedEmp.fromDate, updatedEmp.toDate);
        const remainingDays = originalTotalDays - leaveDays;
        setEmp({ ...updatedEmp, leaveBalance: remainingDays >= 0 ? remainingDays : 0 });
      }
    } else {
      setEmp({ ...emp, [name]: value });
    }
  };

  const calculateLeaveDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including the end date
    return diffDays;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!emp.empName) {
      toast.error('Please select employee name');
      return;
    }
    if (!emp.department) {
      toast.error('Please select department');
      return;
    }
    if (!emp.leaveType) {
      toast.error('Please select leave type');
      return;
    }
    if (!emp.fromDate || !emp.toDate) {
      toast.error('Please enter leave dates');
      return;
    }
    const fromDate = new Date(emp.fromDate);
    const toDate = new Date(emp.toDate);
    if (fromDate > toDate) {
      toast.error('From Date cannot be after To Date');
      return;
    }

    const leaveDays = calculateLeaveDays(emp.fromDate, emp.toDate);
    if (leaveDays > originalTotalDays) {
      toast.error('Requested leave days exceed total leave allotted per year');
      return;
    }

    if (!emp.reason) {
      toast.error('Please enter a valid reason');
      return;
    }

    const remainingDays = originalTotalDays - leaveDays;

    try {
      // Update leaveBalance in the emp object
      const updatedEmp = { ...emp, leaveBalance: remainingDays };

      // Save leave details along with leaveBalance
      await axios.post("http://localhost:5000/leave", updatedEmp);

      toast.success('Record saved successfully');
      // Clear the form after successful submission
      setEmp({
        empName: '',
        department: '',
        leaveType: '',
        totalDays: '',
        leaveBalance: '', // Reset leaveBalance
        fromDate: '',
        toDate: '',
        reason: ''
      });
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Failed to save record. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 shadow">
          <center>
            <h2>Employee Leave Register</h2>
          </center>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <select className='form-control p-2 shadow' id="empName" name="empName" value={emp.empName} onChange={onInput}>
                <option value="">Select Name</option>
                {employee.map(employee => (
                  <option key={employee._id} value={employee._id}>{employee.name} - {employee.email}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <select
                className="form-control p-2 shadow"
                id="department"
                name="department"
                value={emp.department}
                onChange={onInput}
              >
                <option value="">Select Employee Department</option>
                <option value="IT">IT</option>
                <option value="BM">BM</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className="mb-3">
              <select className='form-control p-2 shadow' id="leaveType" name="leaveType" value={emp.leaveType} onChange={onInput}>
                <option value="">Select Leave Type</option>
                {leave.map(val => (
                  <option key={val._id} value={val._id}>{val.leaveName}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="totalDays">Total Leave Allotted/Year (In Days)</label>
              <input
                type="text"
                className="form-control"
                style={{ width: '50px', textAlign: 'center' }}
                id="totalDays"
                name="totalDays"
                value={emp.totalDays}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="leaveBalance">Remaining Leave Balance</label>
              <input
                type="text"
                className="form-control"
                style={{ width: '50px', textAlign: 'center' }}
                id="leaveBalance"
                name="leaveBalance"
                value={emp.leaveBalance}
                disabled={true}
              />
            </div>

            <div className="border p-3 mb-3">
              <p className='text-center' style={{ fontSize: "15px", fontWeight: "bold", color: "green" }}>Leave Approval Section</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="me-2" style={{ flex: 1 }}>
                  <label htmlFor="fromDate">From Date</label>
                  <input
                    type="date"
                    className="form-control p-2 shadow"
                    id="fromDate"
                    name="fromDate"
                    value={emp.fromDate}
                    onChange={onInput}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="toDate">To Date</label>
                  <input
                    type="date"
                    className="form-control p-2 shadow"
                    id="toDate"
                    name="toDate"
                    value={emp.toDate}
                    onChange={onInput}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="reason">Reason</label>
              <input
                type="text"
                className="form-control p-2 shadow"
                placeholder="Enter Valid Reason"
                name="reason"
                value={emp.reason}
                onChange={onInput}
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-success p-2 m-lg-3"
            >
              Submit
            </button>

            <Link to={"/Manage/Leave"}>
              <button className="btn btn-outline-warning p-2">
                Back To Home
              </button>
            </Link>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Add;
