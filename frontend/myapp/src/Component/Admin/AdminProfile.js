import React, { useState, useEffect }  from 'react'; 
import './AdminProfile.css'
import { GrUserAdmin } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

import axios from 'axios';




const AdminProfile = () => {


  const [profile, setProfile] = useState([]);

 
  useEffect(() => {
    axios.get("http://localhost:5000/admins")
      .then(res => {

        setProfile(res.data)
  
        
      })
      .catch(err => console.log(err))
  }, [])


// code for handling deleting records

const handleDelete = (_id) => {
  // Show confirmation dialog
  if (window.confirm("Do you want to delete this admin record?")) {

    // If user confirms, send delete request
    axios.delete(`http://localhost:5000/Delete/${_id}`)
      .then(res => {
      console.log(res.data.message)
      window.location.reload(); // This code refresh the page after deletion
      window.location.href="/Admin/Login";
        
      })
      .catch(err => console.log(err));
  }
}

 

  return (
    <div>

      
        
      
        <div className='employeeTable'>
          <div className='employeeTableContainer'>

          <h4 style={{ textAlign: "center", color: "blue",marginTop:'30px'}}><GrUserAdmin/> Admin Account</h4>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  <th style={{ textAlign: "center" }}>Name</th>
                  <th style={{ textAlign: "center" }}>email</th>
                
                  
                  <th style={{ textAlign: "center" }}>Action</th>
            
                </tr>
              </thead>

              <tbody>
                {profile.map((val, index, arr) => (

                  <tr key={val._id}>
                  <td style={{ textAlign: "center" }}>{val.name}</td>
                  <td style={{ textAlign: "center" }}>{val.email}</td>
                  
                  
                  <td><button className='btn btn-danger' style={{width:'100%'}}onClick={() => handleDelete(val._id)}><MdDelete/> Delete</button></td>
                
                  </tr>

                ))}
          
              </tbody>
               
            </table>

           

          </div>
      
        </div>

     

    </div>
  );
};

export default AdminProfile;
