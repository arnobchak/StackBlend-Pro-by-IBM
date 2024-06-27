import React, { useEffect, useState } from 'react';
import './ShiftScheduleTable.css';
import axios from 'axios';


const ShiftScheduleTable = () => {

  

  
   const [user, setUser] = useState([]);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


 

  useEffect(() => {
    axios.get("http://localhost:5000/GetAllShiftScheduleData") // Endpoint to get data
      .then(res => {
        setUser(res.data)

        
  
        
      })
      .catch(err => console.log(err))
  }, [])

  // code for formatting fromDate and toDate

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 


  


// Code for handle delete function

const handleDelete = (_id) => {
  // Show confirmation dialog
  if (window.confirm("Do you want to delete this shift schedule record permanently?")) {

    // If user confirms, send delete request
    axios.delete(`http://localhost:5000/DeleteShiftSchedule/${_id}`) // Endpoint to delete data
      .then(res => {
      console.log(res.data.message)
      window.location.reload(); // This code refresh the page after deletion
        
      })
      .catch(err => console.log(err));
  }
}

 

  return (
    <div>

      <h4 style={{ textAlign: "center", color: "blue", textDecoration: "underline" }}>Details of Shift Schedule</h4>
        <div className='shiftScheduleTable'>
          <div className='shiftScheduleTableContainer'>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  
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
                {currentItems.map((val) => (

                  <tr key={val._id}>
                  <td style={{ textAlign: "center" }}>{val.employeeId.name}</td>
                  
                  <td style={{ textAlign: "center" }}>{formatDate(val.fromDate)}</td>
                  <td style={{ textAlign: "center" }}>{formatDate(val.toDate)}</td>
                  <td style={{ textAlign: "center",  backgroundColor: val.mon==='Off'? 'yellow': 'inherit'}}>
                    {val.mon === 'Off' ? 'Off' : (val.mon && 
                      (<div>
                      <div>{val.mon.shiftName}</div>
                      <div>({val.mon.startTime}-{val.mon.endTime})</div>
                      </div>))
                    }</td>
                  <td style={{ textAlign: "center",  backgroundColor: val.tue==='Off'? 'yellow': 'inherit'}}>
                    {val.tue === 'Off' ? 'Off' : (val.tue && (<div>
                      <div>{val.tue.shiftName}</div>
                      <div>({val.tue.startTime}-{val.tue.endTime})</div>
                      </div>))}
                    </td>
                  <td style={{ textAlign: "center", backgroundColor: val.wed==='Off'? 'yellow': 'inherit' }}>
                    {val.wed === 'Off' ? 'Off' : (val.wed && (<div>
                      <div>{val.wed.shiftName}</div>
                      <div>({val.wed.startTime}-{val.wed.endTime})</div>
                      </div>))}
                    </td>
                  <td style={{ textAlign: "center" , backgroundColor: val.thu==='Off'? 'yellow': 'inherit'}}>
                    {val.thu === 'Off' ? 'Off' : (val.thu && (<div>
                      <div>{val.thu.shiftName}</div>
                      <div>({val.thu.startTime}-{val.thu.endTime})</div>
                      </div>))}
                    </td>
                  <td style={{ textAlign: "center" , backgroundColor: val.fri==='Off'? 'yellow': 'inherit'}}>
                    {val.fri === 'Off' ? 'Off' : (val.fri && (<div>
                      <div>{val.fri.shiftName}</div>
                      <div>({val.fri.startTime}-{val.fri.endTime})</div>
                      </div>))}
                    </td>
                  <td style={{ textAlign: "center",  backgroundColor: val.sat==='Off'? 'yellow': 'inherit' }}>
                    {val.sat === 'Off' ? 'Off' : (val.sat && (<div>
                      <div>{val.sat.shiftName}</div>
                      <div>({val.sat.startTime}-{val.sat.endTime})</div>
                      </div>))}
                  </td>
                  <td style={{ textAlign: "center" , backgroundColor: val.sun==='Off'? 'yellow': 'inherit'}}>
                    {val.sun === 'Off' ? 'Off' : (val.sun && (<div>
                      <div>{val.sun.shiftName}</div>
                      <div>({val.sun.startTime}-{val.sun.endTime})</div>
                      </div>))}
                    </td>

                  
                  <td><button className='btn btn-danger'onClick={() => handleDelete(val._id)}>Delete</button></td>
                
                  </tr>

                ))}
          
              </tbody>
               
            </table>
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

          <div style={{display:'flex', justifyContent:'center'}}>
            <button type='button' class='btn btn-secondary' onClick={()=>{window.location.href="/Back"}}>Back</button>
          </div>

    </div>
  );
};

export default ShiftScheduleTable;
