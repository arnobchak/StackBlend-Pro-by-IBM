import React, { useState, useEffect }  from 'react';
import {BsPeopleFill} from 'react-icons/bs'
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';




const UpdateEmpTable = () => {

  const [userName, setUserName] = useState('');
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
      
    }
  }, []);
  

  


  const [employee, setEmployee] = useState([]);

  const [editId, setEditId] = useState(-1);

  
  // variable for updating employee data

  const [updateEmployeeMobile, setUpdateEmployeeMobile] = useState("");

  
  useEffect(() => {
    axios.get("http://localhost:5000/GetEmployeeData")//Endpoint to fetch data
      .then(res => setEmployee(res.data))
      .catch(err => console.log(err))
  }, [])



  // code for formatting date of birth and date of joining

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }


// code for handling editing
const handleEdit = (_id) => {
  axios.get(`http://localhost:5000/GetEmployeeById/${_id}`)
    .then(res => {
      console.log(res.data)
      
      
      setUpdateEmployeeMobile(res.data.empMobile);
    })
    .catch(err => console.log(err))

  setEditId(_id)
}

const handleUpdate = () => {

  // validate mobile number
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(updateEmployeeMobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }
  
  axios.put(`http://localhost:5000/UpdateEmployee/${editId}`, { empMobile: updateEmployeeMobile })
    .then(res => {
        alert(res.data.message); // Display message received from the server
        window.location.reload(); // Refresh the page after successful edit
        setEditId(-1);
      }
    )
    .catch(err => {
      // Handle error from Axios
      if (err.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        alert(err.response.data.message); // Display error message from the server
      } else if (err.request) {
        // The request was made but no response was received
        console.log(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
      }
    });
};




 

  return (
    <div >
      

      <h4 style={{ textAlign: "center", color: "blue", marginTop: "50px"}}><BsPeopleFill/> Employee Details</h4>
      <div className='employeeTable'>
        <div className='viewEmployeeTableContainer'>
          <table className="table table-bordered border-primary">
            <thead className="table-light">
              <tr>
              <th style={{ textAlign: "center" }}>Emp Code</th>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Mobile</th>
              <th style={{ textAlign: "center" }}>Date of Birth</th>
              <th style={{ textAlign: "center" }}>Date of Joining</th>
              <th style={{ textAlign: "center" }}>Action</th>
            
              </tr>
            </thead>

            <tbody>
              {employee.map((val, index, arr) => (

              // ternary operator is used for editing
              val._id === editId ? (
                <tr>

                  <td>{val.empCode}</td>
                  <td>{val.empName.name}</td>
                  <td>{val.empEmail.email}</td>
                  <td><input className="form-control" type="text" value={updateEmployeeMobile} onChange={e=>setUpdateEmployeeMobile(e.target.value)}></input></td>
                  <td>{val.empDob}</td>
                  <td>{val.empDoj}</td>
                  <td><button  style={{width:"100%"}} className='btn btn-primary' onClick={handleUpdate}>Update</button></td>




                </tr>
              ):

              (<tr key={val._id}>
                <td style={{ textAlign: "center" }}>{val.empCode}</td>
                <td style={{ textAlign: "center" }}>{val.empName.name}</td>
                <td style={{ textAlign: "center" }}>{val.empEmail.email}</td>
                <td style={{ textAlign: "center" }}>{val.empMobile}</td>
                <td style={{ textAlign: "center" }}>{formatDate(val.empDob)}</td>
                <td style={{ textAlign: "center" }}>{formatDate(val.empDoj)}</td>
                
                <td><button className='btn btn-success' onClick={() => handleEdit(val._id)}
                
                disabled={val.empName.name !== userName}
                
                ><FaEdit/> 
                Edit</button></td>
                
                
              </tr>)

            ))
          }
          
        </tbody>
      </table>
        
       

      </div>
      
      </div>

     

    </div>
  );
};

export default UpdateEmpTable;
