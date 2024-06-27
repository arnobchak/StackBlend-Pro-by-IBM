import React, { useState, useEffect }  from 'react';
import "./ManageMgrAccount.css"
import axios from 'axios';
import { GrUserManager } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";




const ManageMgrAccount = () => {

  
 
  const [user, setUser] = useState([]);

  const [editId, setEditId] = useState(-1);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  
  // variable for updating  data
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  

  


 
  useEffect(() => {
    axios.get("http://localhost:5000/ManagerAccount")
      .then(res => setUser(res.data))
      .catch(err => console.log(err))
  }, [])



  


// code for handling editing
const handleEdit = (_id) => {
  axios.get(`http://localhost:5000/GetAccountById/${_id}`)
    .then(res => {
      console.log(res.data)
      setUpdateEmail(res.data.email);
      setUpdateStatus(res.data.status);
    
    })
    .catch(err => console.log(err))

  setEditId(_id)
}

const handleUpdate = async () => {

  
  
  // validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if input email matches the email format
  if (!emailRegex.test(updateEmail)) {
    
    alert ('Please enter a valid email address.')
    
    return;
  }





  try {
    // Send a PUT request to update the user's email address
    const response = await axios.put(`http://localhost:5000/UpdateAccount/${editId}`, { email: updateEmail , status: updateStatus});

    // If the request is successful, display a success message
    alert(response.data.message);

    // Refresh the page after successful edit
    window.location.reload();

    // Reset the editId state
    setEditId(-1);
  } catch (error) {
    // Handle error from Axios
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      alert(error.response.data.message); // Display error message from the server
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  }
};





  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 

  return (
    <div>
        
      <div className='employeeTable'>
      
        <div className='employeeTableContainer'>
        <h4 style={{ textAlign: "center", color: "blue",marginTop:"20px"}}><GrUserManager/> Manager Account List</h4>
          <table className="table table-bordered border-primary">
            <thead className="table-light">
              <tr>
              
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Role</th>
              <th style={{ textAlign: "center" }}>Status</th>
              
              <th style={{ textAlign: "center" }}>Action</th>
            
              </tr>
            </thead>

            <tbody>
              {currentItems.map((val, index, arr) => (

              // ternary operator is used for editing
              val._id === editId ? (
                <tr>

                  <td>{val.name}</td>
                  
                  <td><input class='form-control p-3' type="text" value={updateEmail}   onChange={e=>setUpdateEmail(e.target.value)}></input></td>

                  <td>{val.role}</td>

                  <td>
                      <select class='form-select  p-3' value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
                        <option value="In-Active">In-Active</option>
                        <option value="Active">Active</option>
                      </select>
                    </td>
                    
                  <td><button  style={{width:"100%"}} className='btn btn-primary' onClick={handleUpdate}>Update</button></td>




                </tr>
              ):

              (<tr key={val._id}>
                
                <td style={{ textAlign: "center" }}>{val.name}</td>
                <td style={{ textAlign: "center" }}>{val.email}</td>
                <td style={{ textAlign: "center" }}>{val.role}</td>
                <td style={{ textAlign: "center" }}>{val.status}</td>

                
                <td><button className='btn btn-success' style={{ width:'100%'}} onClick={() => handleEdit(val._id)}><FaEdit/> Edit</button></td>
                
                
              </tr>)

            ))
          }
          
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

     
      
    </div>
  );
};

export default ManageMgrAccount;
