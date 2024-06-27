import React, { useState, useEffect }  from 'react'; 
import './AdminProfileTable.css'
import axios from 'axios';
import { GrUserAdmin } from "react-icons/gr";


const AdminProfileTable = () => {


  const [profile, setProfile] = useState([]);

 
  useEffect(() => {
    axios.get("http://localhost:5000/admins")
      .then(res => {

        setProfile(res.data)
  
        
      })
      .catch(err => console.log(err))
  }, [])




 

  return (
    <div>
      
      
        <div className='employeeTable'>
          <div className='employeeTableContainer' >
            

          <h4 style={{ textAlign: "center", color: "black", marginTop: "30px"}}><GrUserAdmin/> Admin Account</h4>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  <th style={{ textAlign: "center" }}>Name</th>
                  <th style={{ textAlign: "center" }}>Email</th>
              
            
                </tr>
              </thead>

              <tbody>
                {profile.map((val, index, arr) => (

                  <tr key={val._id}>
                  <td style={{ textAlign: "center" }}>{val.name}</td>
                  <td style={{ textAlign: "center" }}>{val.email}</td>
                
                
                  </tr>

                ))}
          
              </tbody>
               
            </table>

           

          </div>
      
        </div>

     

    </div>
  );
};

export default AdminProfileTable;
