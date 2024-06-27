import React, { useState, useEffect }  from 'react';
import 	'./ShiftTable.css';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";


const ShiftTable = () => {

  const [shiftData, setShiftData] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateStatus, setUpdateStatus] = useState("");


  useEffect(() => {
    axios.get("http://localhost:5000/GetAllShiftData")
      .then(res => {

        setShiftData(res.data)
  
        
      })
      .catch(err => console.log(err))
  }, [])

  // code for handling editing shift status
const handleEdit = (_id) => {
  axios.get(`http://localhost:5000/GetShiftById/${_id}`)//Endpoint 
    .then(res => {
      console.log(res.data)
      
      setUpdateStatus(res.data.status);
    
    })
    .catch(err => console.log(err))

  setEditId(_id)
}

const handleUpdate = async () => {

  


  try {
    // Send a PUT request to update shift status
    const response = await axios.put(`http://localhost:5000/UpdateShiftStatus/${editId}`, {status: updateStatus});

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




 

  return (
    <div>

      
        <div className='shiftTable'>
          <div className='shiftTableContainer'>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                  <th style={{ textAlign: "center" }}>Shift Name</th>
                  <th style={{ textAlign: "center" }}>Start Time</th>
                  <th style={{ textAlign: "center" }}>End Time</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                  
                  <th style={{ textAlign: "center" }}>Action</th>
            
                </tr>
              </thead>

              <tbody>
                {shiftData.map((val, index, arr) => (
                  // ternary operator is used for editing
                  val._id === editId ? (
                  <tr>

                    <td>{val.shiftName}</td>
                    <td>{val.startTime}</td>
                    <td>{val.endTime}</td>
                    <td>
                      <select class='form-control-sm w-100' value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="In-Active">In-Active</option>
                      </select>
                    </td>
                    
                    <td><button  style={{width:"100%"}} className='btn btn-primary' onClick={handleUpdate}>Update</button></td>
                  </tr>
                  ):

                  (<tr key={val._id}>
                  <td style={{ textAlign: "center" }}>{val.shiftName}</td>
                  <td style={{ textAlign: "center" }}>{val.startTime}</td>
                  <td style={{ textAlign: "center" }}>{val.endTime}</td>
                  <td style={{ textAlign: "center" }}>{val.status}</td>

                  <td><button className='btn btn-success' style={{ width:'100%'}} onClick={() => handleEdit(val._id)}><FaEdit/> Edit</button></td>
                
                  </tr>)

                ))}
          
              </tbody>
               
            </table>

          </div>
      
        </div>

     

    </div>
  );
};

export default ShiftTable;
