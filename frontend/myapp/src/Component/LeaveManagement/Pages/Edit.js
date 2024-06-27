import React, { useState, useEffect }  from 'react';
import axios from 'axios';



const Edit = () => {

  

  const [leaveData, setLeaveData] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateDepartment, setUpdateDepartment] = useState("");
  const [updateLeaveType, setUpdateLeaveType] = useState("");
  const[updateLeaveDate, setUpdateLeaveDate]=useState("");
  const[updateReason, setUpdateReason]=useState("");




 

  useEffect(() => {
    axios.get("http://localhost:5000/allDetails")
      .then(res => {

        setLeaveData(res.data)
  
        
      })
      .catch(err => console.log(err))
  }, [])


// code for handling editing shift status

const handleEdit = (_id) => {
  axios.get(`http://localhost:5000/EditLeave/${_id}`)//Endpoint 
    .then(res => {
      console.log(res.data)
      
      setUpdateDepartment(res.data.department);
      setUpdateLeaveType(res.data.leaveType);
      setUpdateLeaveDate(res.data.leaveDate);
      setUpdateReason(res.data.reason);
      
    })
    .catch(err => console.log(err))

  setEditId(_id)
}

const handleUpdate = async () => {


  try {
    // Send a PUT request to update leave record
    const response = await axios.put(`http://localhost:5000/Update/${editId}`, {department:updateDepartment, 
    leaveType:updateLeaveType, leaveDate:updateLeaveDate, reason:updateReason });

    // If the request is successful, display a success message
    alert(response.data.message);
    

    // Return to main page after successful edit
    
    window.location.href=('/Manage/Leave')
    

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

      <h4 style={{ textAlign: "center", color: "blue", margin:'40px' }}> Edit Leave  Details </h4>
        <div className='shiftTable'>
          <div className='shiftTableContainer'>
            <table className="table table-bordered border-primary">
              <thead className="table-light">
                <tr>
                <th style={{ textAlign: "center", backgroundColor:'rgb(220,229,236' }}>Emp ID</th>
                  <th style={{ textAlign: "center",backgroundColor:'rgb(220,229,236' }}>Emp Name</th>
                  <th style={{ textAlign: "center",backgroundColor:'rgb(220,229,236' }}>Department</th>
                  <th style={{ textAlign: "center" ,backgroundColor:'rgb(220,229,236'}}>Leave Type</th>
                  <th style={{ textAlign: "center" ,backgroundColor:'rgb(220,229,236'}}>Leave Date</th>
                  <th style={{ textAlign: "center",backgroundColor:'rgb(220,229,236' }}>Reason</th>
                  
                  
                  <th style={{ textAlign: "center",backgroundColor:'rgb(220,229,236' }}>Action</th>
            
                </tr>
              </thead>

              <tbody>
                {leaveData.map((val, index, arr) => (
                  // ternary operator is used for editing
                  val._id === editId ? (
                  <tr>

                    {/* ========================================================================== */}

                    <td style={{textAlign:'center', color:'magenta'}}>{val.empName._id}</td>
                    {/* =========================================================================== */}
                    <td>{val.empName.name}</td> 
                    {/* ========================================================================== */}
                    <td>
                    <select className="form-control-sm w-100 p-3 shadow" 
                    value={updateDepartment} 
                    onChange={(e) => setUpdateDepartment(e.target.value)}
                    >
                    <option value="">Select Employee Department</option>
                    <option value="IT">IT</option>
                    <option value="BM">BM</option>
                    <option value="HR">HR</option>
                    </select>
                    </td>

                    {/* =============================================================================== */}

                    <td>
                    <select
                    className="form-control-sm w-100 p-3 shadow"
                    value={updateLeaveType}
                    onChange={(e) => setUpdateLeaveType(e.target.value)}
                    >
                    <option value="">Select Leave</option>
                    <option value="Casual leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Duty Leave">Duty Leave</option>
                    <option value="Restricted Holidays">Restricted Holidays</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Leave without Pay">Leave without Pay</option>
                    </select>

                    </td>

                    {/* ================================================================================================== */}

                    
                    <td>
                    <input type="date" 
                    class=	"form-control-sm w-100 p-3 shadow" 
                    value={updateLeaveDate} 
                    onChange={e=>setUpdateLeaveDate(e.target.value)}>

                    </input>
                  
                    </td>

                    {/* ===================================================================================================== */}
                    <td>
                    <input type="text" 
                    class=	"form-control-sm w-100 p-3 shadow" 
                    value={updateReason} 
                    onChange={e=>setUpdateReason(e.target.value)}
                    >
                    </input></td>


                
                    
                    
                    <td><button  style={{width:"100%"}} className='btn btn-primary' onClick={handleUpdate}>Update</button></td>
                  </tr>
                  ):

                  (<tr key={val._id}>

                  <td style={{ textAlign: "center", color:'magenta' }}>{val.empName._id}</td>
                  <td style={{ textAlign: "center" }}>{val.empName.name}</td>
                  <td style={{ textAlign: "center" }}>{val.department}</td>
                  <td style={{ textAlign: "center" }}>{val.leaveType}</td>
                  <td style={{ textAlign: "center" }}>{val.leaveDate}</td>
                  <td style={{ textAlign: "center" }}>{val.reason}</td>

                  <td><button className='btn btn-success' style={{ width:'100%'}} onClick={() => handleEdit(val._id)}>Edit</button></td>
                
                  </tr>)

                ))}
          
              </tbody>
               
            </table>

          </div>
      
        </div>

     

    </div>
  );
};

export default Edit;
