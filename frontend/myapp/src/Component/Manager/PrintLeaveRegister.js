import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import logo from '../Manager/sbpro1.png';
import './PrintLeaveRegister.css';
import { PiPrinterLight } from "react-icons/pi";

const PrintLeaveRegister = () => {
  const componentPdf = useRef();

  const generatePDF = useReactToPrint({
    content: () => componentPdf.current,
    documentTitle: 'Employee Leave Register',
    onAfterPrint: () => alert('Data printed successfully.'),
  });

  const [leaveData, setLeaveData] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:5000/leave-request-data")
      .then(res => {
        setLeaveData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

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

  const approvedLeaveData = leaveData.filter(val => val.status === 'Approved');

  return (
    <div className="container my-4">
      <div ref={componentPdf} className="print-container">
        <img src={logo} className="logo" alt='Company Logo' />
        
        <div className="report-header">
          <h3 className="text-center mt-4">Employee Leave Register</h3>
          <p className="text-center font-weight-bold">Company XYZ</p>
          <p className="text-center font-weight-bold">Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th className="text-center bg-pink" rowSpan={2}>Emp Name</th>
                <th className="text-center bg-pink" rowSpan={2}>Deptt</th>
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
              </tr>
              <tr>
                <th className="text-center bg-pink">From Date</th>
                <th className="text-center bg-pink">To Date</th>
              </tr>
            </thead>
            <tbody>
              {approvedLeaveData.map((val) => (
                <tr key={val._id}>
                  <td className="text-center" style={{fontWeight: 'bold'}}>
                    {val.employeeId.name}
                  </td>
                  <td className="text-center">{val.department}</td>
                  <td className="text-center">{val.leaveType.leaveName}</td>
                  <td className="text-center">{val.totalDays}</td>
                  <td className="text-center">{val.leaveBalance}</td>
                  <td className="text-center">{formatDate(val.startDate)}</td>
                  <td className="text-center">{formatDate(val.endDate)}</td>
                  <td className="text-center">{calculateTotalDays(val.startDate, val.endDate)}</td>
                  <td className="text-center" style={{fontWeight: 'bold'}}>
                    {val.applicantName}
                  </td>
                  <td className="text-center">{formatDate(val.dateOfApplication)}</td>
                  <td className="text-center">{val.reason}</td>
                  <td className="text-center">{val.remarks}</td>
                  <td className="text-center">
                    {val.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-grid d-md-flex justify-content-md-end mb-3">
          <button className="btn btn-success" onClick={generatePDF}>
            <PiPrinterLight /> Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintLeaveRegister;
