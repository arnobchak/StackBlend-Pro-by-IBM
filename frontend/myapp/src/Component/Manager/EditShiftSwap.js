import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const EditShiftSwap = () => {

  const [user, setUser] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateStatus, setUpdateStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 
  useEffect(() => {
    axios.get("http://localhost:5000/GetAllShiftSwapData") // Endpoint to get data
      .then(res => {
        setUser(res.data)

        
  
        
      })
      .catch(err => console.log(err))
  }, [])


// ====================================================================================
  
  // code for handling editing shift swap  status
const handleEdit = (_id) => {
  axios.get(`http://localhost:5000/GetAllShiftSwapById/${_id}`)//Endpoint 
    .then(res => {
      console.log(res.data)
      
      setUpdateStatus(res.data.status);
    
    })
    .catch(err => console.log(err))

  setEditId(_id)
}

// =============================================================================

  // code for formatting original date and requested date

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

//  ===================================================================================
const handleUpdate = async () => {


  try {
    // Send a PUT request to update shift  swap status
    const response = await axios.put(`http://localhost:5000/UpdateShiftSwapStatus/${editId}`, {status: updateStatus});

    // If the request is successful, display a success message
    alert(response.data.message);

    // Refresh the page after successful edit
    window.location.reload();

    // Reset the editId state
    setEditId(-1);
  } catch (error) {

    // Handle error from Axios
    if (error.response) {
      
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

// ==========================================================================================
// code for handling delete

const handleDelete= (_id) => {
  // Show confirmation dialog
  if (window.confirm ("Do you want to delete this record?")) {

    // If user confirms, send delete request
    axios.delete(`http://localhost:5000/DeleteShiftSwap/${_id}`)
      .then(res => {
      console.log(res.data.message)
      window.location.reload(); // This code refresh the page after deletion
        
      })
      .catch(err => console.log(err));
  }
}

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
                  <th colSpan={2} style={{ textAlign: "center" }}>Action</th>
                  
                  
                  
                  
            
                </tr>
              </thead>

              <tbody>
                {currentItems.map((val) => (

                  // ternary operator is used for editing
                  val._id === editId ? (
                    <tr>
  
                      
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
                      <td>
                        <select class='form-control-sm w-100' value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
                          
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Not approved">Not-Approved</option>
                        </select>
                      </td>
                      
                      <td colSpan={2}><button  style={{width:"100%"}} className='btn btn-primary' onClick={handleUpdate}>Update</button></td>
                    </tr>
                    ):

                  (<tr key={val._id}>

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

                <td style={{textAlign:'center', fontWeight: 'bold',color:val.status==='Approved'? 'green':'inherit'}}>{val.status}</td>

                {/* ==================================================================================================== */}
                <td><button className='btn btn-success' style={{ width:'100%'}} onClick={() => handleEdit(val._id)}><FaEdit/> Edit</button></td>
                <td><button className='btn btn-danger' style={{ width:'100%'}} onClick={() => handleDelete(val._id)}><MdDelete/> Delete</button></td>

                  </tr>)


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

export default EditShiftSwap;
