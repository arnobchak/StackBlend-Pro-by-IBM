import React, { useEffect, useState } from 'react';
import './ViewShiftSchedule.css';
import axios from 'axios';


const ViewShiftSchedule = () => {

  

  const [shiftScheduleData, setShiftScheduleData] = useState([]);



 

  useEffect(() => {
    axios.get("http://localhost:5000/GetAllShiftScheduleData") // Endpoint to get data
      .then(res => {

        setShiftScheduleData(res.data)
  
        
      })
      .catch(err => console.log(err))
  }, [])

  // code for formatting fromDate and toDate

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  



 

  return (
    <div>

      <h4 id="title">Employee-wise Shift Schedule</h4>


      
        <div className='shiftScheduleTable'>
          
          <div className='shiftScheduleTableContainer'>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  <th style={{ textAlign: "center" }}>Emp code</th>
                  <th style={{ textAlign: "center" }}>Emp Name</th>
                  <th style={{ textAlign: "center" }}>From Date</th>
                  <th style={{ textAlign: "center" }}>To Date</th>
                  <th style={{ textAlign: "center" }}>Mon</th>
                  <th style={{ textAlign: "center" }}>Tue</th>
                  <th style={{ textAlign: "center" }}>Wed</th>
                  <th style={{ textAlign: "center" }}>Thu</th>
                  <th style={{ textAlign: "center" }}>Fri</th>
                  <th style={{ textAlign: "center" }}>Sat</th>
                  <th style={{ textAlign: "center" }}>Sun</th>
                  
                  <th style={{ textAlign: "center" }}>Action</th>
            
                </tr>
              </thead>

              <tbody>
                {shiftScheduleData.map((val) => (

                  <tr key={val._id}>
                  <td style={{ textAlign: "center" }}>{val.employeeId.empCode}</td>
                  <td style={{ textAlign: "center" }}>{val.employeeId.empName}</td>
                  <td style={{ textAlign: "center" }}>{formatDate(val.fromDate)}</td>
                  <td style={{ textAlign: "center" }}>{formatDate(val.toDate)}</td>
                  <td style={{ textAlign: "center" }}>{val.mon.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.tue.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.wed.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.thu.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.fri.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.sat.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.sun.shiftName}</td>
                
                  
                  <td><button className='btn btn-primary'>Request</button></td>
                
                  </tr>

                ))}
          
              </tbody>
               
            </table>

            <div className='display'>
            <p>Morning : Morning Shift</p>
            <p>Evening : Evening Shift</p>
            <p>Night : Night Shift</p>
            <p>General : General Shift</p>
            <p>Off : Weekly Off</p>
            </div>

            <div style={{display:'flex', justifyContent:'center'}}>
            <button type='button' class='btn btn-secondary' onClick={()=>{window.location.href="/Employee/Dashboard"}}>Back</button>
            </div>

           
          </div>

          
      
        </div>

     

    </div>
  );
};

export default ViewShiftSchedule;
