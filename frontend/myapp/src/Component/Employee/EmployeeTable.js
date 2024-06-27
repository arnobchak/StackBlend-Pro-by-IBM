import React, { useState, useEffect }  from 'react';
import './EmployeeTable.css';
import axios from 'axios';
import { MdDelete } from "react-icons/md";



const EmployeeTable = () => {

  const [employee, setEmployee] = useState([]);



  useEffect(() => {
    axios.get("http://localhost:5000/GetAllEmployees")
      .then(res => setEmployee(res.data))
      .catch(err => console.log(err))
  }, [])



  // code for formatting date of birth and date of joining

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }





    

// code for handling deleting records

const handleDelete = (_id) => {
  // Show confirmation dialog
  if (window.confirm("Do you want to delete this employee?")) {

    // If user confirms, send delete request
    axios.delete(`http://localhost:5000/DeleteEmployee/${_id}`)
      .then(res => {
      console.log(res.data.message)
      window.location.reload(); // This code refresh the page after deletion
        
      })
      .catch(err => console.log(err));
  }
}

 

  return (
    <div>
      

      <h4 style={{ textAlign: "center", color: "blue", marginTop: "50px"}}> Employee List</h4>
      <div className='employeeTable'>
        <div className='employeeTableContainer'>
          <table className="table table-bordered border-primary">
            <thead className="table-light">
              <tr>
              <th style={{ textAlign: "center" }}>Emp ID</th>
              <th style={{ textAlign: "center" }}>Emp Code</th>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Mobile</th>
              <th style={{ textAlign: "center" }}>Date of Birth</th>
              <th style={{ textAlign: "center" }}>Date of Joining</th>
              <th colSpan={2} style={{ textAlign: "center" }}>Action</th>
            
              </tr>
            </thead>

            <tbody>
              {employee.map((val, index, arr) => (

              <tr key={val._id}>
                <td style={{ textAlign: "center" }}>{val.empName._id}</td>
                <td style={{ textAlign: "center" }}>{val.empCode}</td>
                <td style={{ textAlign: "center" }}>{val.empName.name}</td>
                <td style={{ textAlign: "center" }}>{val.empEmail.email}</td>
                <td style={{ textAlign: "center" }}>{val.empMobile}</td>
                <td style={{ textAlign: "center" }}>{formatDate(val.empDob)}</td>
                <td style={{ textAlign: "center" }}>{formatDate(val.empDoj)}</td>
                
                
                <td><button className='btn btn-danger' onClick={() => handleDelete(val._id)}>
                <MdDelete/>
                Delete</button></td>
                
              </tr>

            ))
          }
          
        </tbody>
      </table>
        
       

      </div>
      
      </div>

     

    </div>
  );
};

export default EmployeeTable;
