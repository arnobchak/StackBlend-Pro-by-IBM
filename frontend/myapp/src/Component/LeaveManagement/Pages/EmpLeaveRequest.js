import React, { useEffect, useState } from 'react';

import axios from 'axios';



const EmpLeaveRequest = () => {
   const [user, setUser] = useState([]);
   
  useEffect(() => {
    axios.get("http://localhost:5000/leave-request-data") // Endpoint to get data
      .then(res => {
        setUser(res.data)       
      })
      .catch(err => console.log(err))
  }, [])

  // code for formatting original date and requested date

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

 


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
                  <th style={{ textAlign: "center",backgroundColor: 'pink' }}>Status</th>
                  
                  
                  
            
                </tr>
              </thead>

              <tbody>
                {user.map((val) => (

                  <tr key={val._id}>

                  {/* ========================================================================= */}
                  {/* Employee name and id */}
                  <td style={{ textAlign: "center" }}>{val.employeeId &&
                  <div>
                    <div style={{color: 'gray'}}>( {val.employeeId._id} )</div>
                    <div style={{fontWeight:'bold'}}>{val.employeeId.name}</div>

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

                {/* ================================================================*/}
                {/* Status */}

                <td style={{ textAlign: 'center', fontWeight: 'bold', color: val.status === 'Approved' ? 'green' : 'red' }}>
                {val.status}</td>

                </tr>

                ))}
          
              </tbody>
               
            </table>
            
          </div>
      
        </div>

      

    </div>
  );
};

export default EmpLeaveRequest;
