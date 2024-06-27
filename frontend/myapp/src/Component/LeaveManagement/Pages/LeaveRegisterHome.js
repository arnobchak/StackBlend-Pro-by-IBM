import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LeaveRegisterHome = () => {
  const [emp, setEmp] = useState([]);


  useEffect(() => {
    loadEmployee();
  }, []);

  //Date format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const loadEmployee = async () => {
    const result = await axios.get("http://localhost:5000/allDetails");
    
    setEmp(result.data);
  };

  // Code for handle delete function

    const deleteEmp = (_id) => {
  // Show confirmation dialog
  if (window.confirm("Do you want to delete this shift schedule record permanently?")) {

    // If user confirms, send delete request
    axios.delete(`http://localhost:5000/DeleteLeaveRecord/${_id}`) // Endpoint to delete data
    
      .then(res => {
      console.log(res.data.message)
      loadEmployee();
        
      })
      .catch(err => console.log(err));
  }
}

 

  return (
    <div>
      
      <table className="table container ">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Emp ID/Name</th>
            <th scope="col">Emp Department</th>
            <th scope="col">Leave Type</th>
            <th scope="col">Leave Date</th>
            <th scope="col">Reason</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {emp.map((val, i) => (
            <tr key={val._id}> {/* Ensure each row has a unique key */}
              <td>{i + 1}</td>
              <td>{val.empName &&
              
              <div>
                <div style={{color:'magenta'}}>[ {val.empName._id} ]</div>
                <div style={{fontWeight:'bold'}}>{val.empName.name}</div>



              </div>
              
              
              }</td>
              <td>{val.department}</td>
              <td>{val.leaveType}</td>
              <td>{formatDate(val.leaveDate)}</td>
              <td>{val.reason}</td>
              <td>
                <Link to={`/edit/:id`}>
                  <button className="btn btn-outline-info m-lg-2">Edit</button>
                </Link>
                
                <button
                  onClick={() => deleteEmp(val._id)}
                  className="btn btn-outline-danger m-lg-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRegisterHome;
