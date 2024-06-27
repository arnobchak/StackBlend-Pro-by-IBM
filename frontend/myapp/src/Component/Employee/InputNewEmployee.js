import React,{useState} from 'react'
import "./InputNewEmployee.css"
import axios from 'axios'



const InputNewEmployee = () => {

  
// Use state react hook
  const [employee, setEmployee] = useState({
    empCode: "",
    empName: "",
    empEmail: "",
    empMobile:"",
    empDob:"",
    empDoj:""
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to store error message


  

  const handleChange = e => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value 
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { empCode,empName, empEmail, empMobile, empDob, empDoj} = employee;

    // Check if any field is empty

    if(!empCode || !empName || !empEmail || !empMobile || !empDob || !empDoj){
      setErrorMessage('Please fill in all fields.');
      return;
    };

    // validation for positive employee code

    if(empCode <= 0){
      setErrorMessage('Employee Code must be positive number.');
      return;
    };

    // validation for employee email

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if empEmail matches the email format
    if (!emailRegex.test(empEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Check if empMobile matches the mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(empMobile)) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    };

    // Date format regex (YYYY-MM-DD)
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Validate Date of Birth format and range
    if (!dateFormatRegex.test(empDob) || new Date(empDob) >= new Date()) {
    setErrorMessage('Please enter a valid Date of Birth.');
    return;
    }

    // Validate Date of Joining format and range
    if (!dateFormatRegex.test(empDoj) || new Date(empDoj) <= new Date(empDob) || new Date(empDoj)> new Date()) {
    setErrorMessage('Please enter a valid Date of joining');
    return;
    }
    
    // Send employee data to backend after validation

    if ( empCode && empName && empEmail && empMobile && empDob && empDoj) {
      axios.post("http://localhost:5000/AddEmployee", employee)
        .then(res => {
          alert(res.data.message); // Alert success message

          // Clear form fields after successful submission
          setEmployee({...employee,
            empCode: "",
            empName: "",
            empEmail: "",
            empMobile:"",
            empDob:"",
            empDoj:""
      
            
          })

          setErrorMessage(""); // Clear any previous error messages
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message); // Set error message
          } else {
            setErrorMessage("An unexpected error occurred."); // Set generic error message
          }
        });
    }

    
  }

  




  return (

  

    <div>

      <div className='inputNewEmployeeContainer'>

        <div className='inputNewEmployeeFormBox'>

          <div>
            <h4 id="inputNewEmployeeFormHeading">New Employee Form</h4>
          </div>

          <div className='inputNewEmployeeDiv'>
            <label className='inputNewEmployeeLabel'>Emp Code</label>
            <input   
            className='form-control' 
            type='number' 
            placeholder='Enter unique code'
             name="empCode" 
             value={employee.empCode} 
             onChange={handleChange}></input>
          </div>

          

          <div className='inputNewEmployeeDiv'>
            <label className='inputNewEmployeeLabel'>Emp Name</label>
            <input   
            className='form-control' 
            type='text' 
            placeholder='Enter Name'
             name="empName" 
             value={employee.empName} 
             onChange={handleChange}></input>
          </div>

          <div className='inputNewEmployeeDiv'>
            <label className='inputNewEmployeeLabel'>Emp Email</label>
            <input 
            className='form-control' 
            type='email' 
            placeholder='abc@example.com'
            name="empEmail" 
            value={employee.empEmail} 
            onChange={handleChange}></input>
          </div>

          <div className='inputNewEmployeeDiv'>
            <label className='inputNewEmployeeLabel'>Emp Mobile</label>
            <input 
            className='form-control' 
            type='phone' 
            placeholder='Enter 10-digit mobile number' 
            name="empMobile" 
            value={employee.empMobile} 
            onChange={handleChange}></input>
          </div>

          <div className='inputNewEmployeeDiv'>
            <label className='inputNewEmployeeLabel'>Date of Birth</label>
            <input 
            className='form-control' 
            type='date' 
            placeholder='Enter Date of Birth' 
            name="empDob" 
            value={employee.empDob} 
            onChange={handleChange}></input>

          </div >

          <div className='inputNewEmployeeDiv'>
            <label className='inputNewEmployeeLabel'>Date of Joining</label>
            <input 
            className='form-control' 
            type='date' 
            placeholder='Enter Date of Joining' 
            name="empDoj" 
            value={employee.empDoj} 
            onChange={handleChange}></input>

          </div >


        
          <div class="btn-group m-4 d-flex justify-content-center" role="group" aria-label="Basic outlined example">
            
            <button 
            type="button" 
            onClick={() => window.location.href = "/Manager/Dashboard"} 
            class="btn btn-outline-primary">Back to Dashboard</button>


            <button 
            type="submit" 
            class="btn btn-outline-primary" 
            onClick={handleSubmit}>Submit</button>

          </div>
          {errorMessage && <div className="error-message" style={{textAlign:"center"}}>{errorMessage}</div>} {/* Display error message */}
        </div>

      </div>

      

      

      

      

        
   </div>

  );
}

export default InputNewEmployee;

      

    

      

      

    
      




      
  
      
      

      
               
        
      

      
    
    
        


