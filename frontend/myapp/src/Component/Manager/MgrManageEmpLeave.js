import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";

const MgrManageEmpLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/leave-request-data")
      .then(res => {
        setLeaveData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleEdit = (_id) => {
    axios.get(`http://localhost:5000/leave-request-data/${_id}`)
      .then(res => {
        setUpdateRemarks(res.data.remarks);
        setUpdateStatus(res.data.status);
      })
      .catch(err => console.log(err));

    setEditId(_id);
  };

  const handleUpdate = async () => {
    if (updateStatus === 'Rejected' && !updateRemarks) {
      toast.error('Please enter reason for Rejection');
      return;
    }

    try {
      // Find the leave record by editId
      const leaveRecord = leaveData.find(record => record._id === editId);
      let updatedLeaveBalance = leaveRecord.leaveBalance;

      // Adjust leave balance based on the status update
      if (leaveRecord.status === 'Approved' || leaveRecord.status === 'Pending') {
        updatedLeaveBalance += calculateTotalDays(leaveRecord.startDate, leaveRecord.endDate);
      }

      if (updateStatus === 'Approved' || updateStatus === 'Pending') {
        updatedLeaveBalance -= calculateTotalDays(leaveRecord.startDate, leaveRecord.endDate);
      }

      await axios.put(`http://localhost:5000/Update-leave-request-data/${editId}`, {
        remarks: updateRemarks,
        status: updateStatus,
        leaveBalance: updatedLeaveBalance
      });

      alert('Record updated successfully.');
      window.location.reload();
      setEditId(-1);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }
  };

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const daysDiff = timeDiff / (1000 * 3600 * 24) + 1; // +1 to include the start day
    return daysDiff;
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="container my-4">
      <h4 className="text-center text-tertiary mb-4">Leave Register</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th className="text-center bg-pink" rowSpan={2}>Emp Name</th>
              <th className="text-center bg-pink" rowSpan={2}>Department</th>
              <th className="text-center bg-pink" rowSpan={2}>Leave Type</th>
              <th className="text-center bg-pink" rowSpan={2}>Leave Alloted</th>
              <th className="text-center bg-pink" rowSpan={2}>Leave Bal</th>
              <th className="text-center bg-pink" colSpan={2}>Leave Duration</th>
              <th className="text-center bg-pink" rowSpan={2}>Total Days</th>
              <th className="text-center bg-pink" rowSpan={2}>Applicant</th>
              <th className="text-center bg-pink" rowSpan={2}>Applied On</th>
              <th className="text-center bg-pink" rowSpan={2}>Reason</th>
              <th className="text-center bg-pink" rowSpan={2}>Manager Remarks</th>
              <th className="text-center bg-pink" rowSpan={2}>Status</th>
              <th className="text-center bg-pink" rowSpan={2}>Action</th>
            </tr>
            <tr>
              <th className="text-center bg-pink">From Date</th>
              <th className="text-center bg-pink">To Date</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((val) => (
              val._id === editId ? (
                <tr key={val._id}>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.employeeId.name}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.department}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.leaveType.leaveName}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.totalDays}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.leaveBalance}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{formatDate(val.startDate)}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{formatDate(val.endDate)}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{calculateTotalDays(val.startDate, val.endDate)}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.applicantName}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{formatDate(val.dateOfApplication)}</td>
                  <td style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.reason}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm p-3"
                      value={updateRemarks}
                      onChange={e => setUpdateRemarks(e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                     
                      className="form-control form-control-sm p-3"
                      value={updateStatus}
                      onChange={e => setUpdateStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={val._id}>
                  <td className="text-center" style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.employeeId.name}</td>
                  <td className="text-center">{val.department}</td>
                  <td className="text-center">{val.leaveType.leaveName}</td>
                  <td className="text-center">{val.totalDays}</td>
                  <td className="text-center">{val.leaveBalance}</td>
                  <td className="text-center">{formatDate(val.startDate)}</td>
                  <td className="text-center">{formatDate(val.endDate)}</td>
                  <td className="text-center">{calculateTotalDays(val.startDate, val.endDate)}</td>
                  <td className="text-center" style={{color: val.employeeId.name !== val.applicantName ? 'red' : 'black', fontWeight: 'bold'}}>{val.applicantName}</td>
                  <td className="text-center">{formatDate(val.dateOfApplication)}</td>
                  <td className="text-center">{val.reason}</td>
                  <td className="text-center">{val.remarks}</td>
                  <td className="text-center" style={{color: val.status === 'Approved' ? 'green' : 'red'}}>{val.status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => handleEdit(val._id)}
                    >
                      <FaEdit /> Edit
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </div>
  );
};

export default MgrManageEmpLeave;
