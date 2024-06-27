import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';


const ViewLeaveRequestStatus = () => {

  const [user, setUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


 

  useEffect(() => {
    axios.get("http://localhost:5000/leave-request-data") // Endpoint to get data
      .then(res => {
        setUser(res.data)

        
  
        
      })
      .catch(err => console.log(err))
  }, [])

  // code for formatting date

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  


  return (
    <div>

      <h4 style={{ textAlign: "center", color: "blue",margin:"20px"}}>Leave Request Status</h4>
        <div className='shiftScheduleTable'>
          <div className='shiftScheduleTableContainer'>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  
                  <th style={{ textAlign: "center", backgroundColor: 'pink' }}>Emp ID/Name</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Department</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Leave Type</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Start Date</th>
                  <th style={{ textAlign: "center" ,backgroundColor: 'pink'}}>End Date</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Reason</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Applicant</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Date of Application</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Manager Remark</th>
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Status</th>
                  
                  
                  
            
                </tr>
              </thead>

              <tbody>
                {currentItems.map((val) => (

                  <tr key={val._id}>

                  {/* ========================================================================= */}
                  {/* Employee name and id */}
                  <td style={{ textAlign: "center" }}>{val.employeeId &&
                  <div>
                    <div style={{color: 'gray'}}>( {val.employeeId._id} )</div>
                    <div style={{fontWeight:'bold',color:val.employeeId.name!==val.applicantName?'red':'black'}}>{val.employeeId.name}</div>

                  </div>
                  
                  
                  }</td>

                  {/* ========================================================*/}
                  {/* Department */}
                  
                  <td style={{ textAlign: "center" }}>{val.department}</td>

                  {/* ========================================================*/}
                  {/* Leave Type */}

                  <td style={{ textAlign: "center" }}>{val.leaveType.leaveName}</td>

                  
                {/* ============================================================= */}
                  {/* Start Date */}
                  <td style={{textAlign:'center'}}>{formatDate(val.startDate)}</td>

                {/*=================================================================*/}
                {/* End Date */}
                <td style={{textAlign:'center'}}>{formatDate(val.endDate)}</td>

                {/* ===============================================================*/}
                {/* Reason */}

                <td style={{textAlign:'center'}}>{val.reason}</td>

                {/* ============================================================== */}
                {/* Applicant */}
                <td style={{textAlign:'center', color:val.employeeId.name!==val.applicantName?'red':'black', fontWeight:'bold'}}>{val.applicantName}</td>

                {/* ===================================================================== */}
                {/* Date of Application */}
                <td style={{textAlign:'center'}}>{formatDate(val.dateOfApplication)}</td>

                {/* =================================================== */}
                {/* Manager Remarks */}
                <td style={{ textAlign: "center" }}>{val.remarks}</td>

                {/* ================================================================*/}
                {/* Status */}

                <td style={{ textAlign: 'center', fontWeight: 'bold', color: val.status === 'Approved' ? 'green' : 'red' }}>
                {val.status}</td>

                </tr>

                ))}
          
              </tbody>
               
            </table>

            {/* ==============================================================*/}
            {/* Table pagination code */}
            <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(user.length / itemsPerPage) }).map((_, index) => (
              <li key={index} className="page-item">
                <button onClick={() => paginate(index + 1)} className='page-link'>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
          </div>
      
        </div>

      

    </div>
  );
};

export default ViewLeaveRequestStatus;
