import React, { useEffect, useState } from 'react';

import axios from 'axios';


const ViewShiftSwap = () => {

  const [user, setUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios.get("http://localhost:5000/GetAllShiftSwapData") // Endpoint to get data
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 


  



 

  return (
    <div>

      <h4 style={{ textAlign: "center", color: "blue",marginTop:"20px"}}>Shift Swap Request Status</h4>
        <div className='shiftScheduleTable'>
          <div className='shiftScheduleTableContainer'>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  
                  <th style={{ textAlign: "center" }}>Requestor Name/Email</th>
                  <th style={{ textAlign: "center" }}>Original Date/Shift</th>
                  <th style={{ textAlign: "center" }}>Requested Date/Shift</th>
                  <th style={{ textAlign: "center" }}>Reason</th>
                  <th style={{ textAlign: "center" }}>Submission Date</th>
                  <th style={{ textAlign: "center" }}>Counter-Part Name/Email</th>
                  <th style={{ textAlign: "center" }}>Remarks</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  
                  
                  
            
                </tr>
              </thead>

              <tbody>
                {currentItems.map((val) => (

                  <tr key={val._id}>

                  {/* ========================================================================= */}
                  {/* Employee name and email */}
                  <td style={{ textAlign: "center" }}>{val.employeeId &&
                  <div>
                    <div style={{fontWeight:'bold'}}>{val.employeeId.name}</div>
                    <div style={{color:'blue'}}>{val.employeeId.email}</div>

                  </div>
                  
                  
                  }</td>

                  {/* ==================================================================================== */}
                  {/* Original shift and date */}
                  
                  <td style={{ textAlign: "center" }}>{val&&
                  <div>

                    <div>{formatDate(val.originalDate)}</div>
                    <div style={{fontWeight:'bold', color:'red'}}> {val.originalShift.shiftName}</div>
                    <div style={{fontWeight:'bold', color:'red'}}> [{val.originalShift.startTime}-{val.originalShift.endTime}]</div>

                  </div>
                  }</td>

                  {/* ========================================================================================== */}
                  {/* Requested shift and date */}

                  <td style={{ textAlign: "center" }}>{val&&
                  <div>

                    <div>{formatDate(val.requestedDate)}</div>
                    <div style={{fontWeight:'bold', color:'red'}}> {val.requestedShift.shiftName}</div>
                    <div style={{fontWeight:'bold', color:'red'}}> [{val.requestedShift.startTime}-{val.requestedShift.endTime}]</div>

                  </div>
                  }</td>
                
                {/* ============================================================================================================== */}
                  {/* Reason */}
                  <td style={{textAlign:'center'}}>{val.reason}</td>

                {/*===============================================================================================================  */}
                {/* Date of submission */}
                <td style={{textAlign:'center'}}>{formatDate(val.submissionDate)}</td>

                {/* ======================================================================================= */}
                {/* counter-part name and email */}

                  <td style={{ textAlign: "center" }}>{val&&
                  <div>
                    <div style={{fontWeight:'bold'}}>{val.counterPartEmail.name}</div>
                    <div style={{color:'blue'}}>{val.counterPartEmail.email}</div>

                  </div>
                  
                  
                  }</td>
                
                {/* =============================================================================================== */}
                {/* Remarks */}

                <td style={{textAlign:'center'}}>{val.notes}</td>

                {/* ================================================================================================= */}
                {/* Status */}

                <td style={{ textAlign: 'center', fontWeight: 'bold', color: val.status === 'Approved' ? 'green' : val.status !== 'Approved' ? 'red' : 'inherit' }}>{val.status}</td>



                {/* ==================================================================================================== */}

                  </tr>

                ))}
          
              </tbody>
               
            </table>

            {/* =========================================================================================================== */}
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

export default ViewShiftSwap;
