import React, { useState} from "react";
import "./App.css";


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Component/Home";
import Login from "./Component/Admin/Login"
import Register from "./Component/Admin/Register"
import ManagerLogin from "./Component/Manager/ManagerLogin";
import EmployeeLogin from "./Component/Employee/EmployeeLogin";
import ManagerDash from "./Component/Manager/ManagerDash";
import ManagerEditProfile from "./Component/Manager/ManagerEditProfile";
import ManagerProfile from "./Component/Manager/ManagerProfile";
import ManagerAddEmployee from "./Component/Manager/ManagerAddEmployee";
import ManagerViewEmployee from "./Component/Manager/ManagerViewEmployee";
import ManagerAddShift from "./Component/Manager/ManagerAddShift";
import ManagerCreateSchedule from "./Component/Manager/ManagerCreateSchedule";
import ManagerViewSchedule from "./Component/Manager/ManagerViewSchedule";
import AdminDash from "./Component/Admin/AdminDash";
import ManageAdminAccount from "./Component/Admin/ManageAdminAccount";
import CreateManagerAccount from "./Component/Admin/CreateManagerAccount";
import ManageManagerAccount from "./Component/Admin/ManageManagerAccount";
import CreateEmployeeAccount from "./Component/Admin/CreateEmployeeAccount";
import ManageEmployeeAccount from "./Component/Admin/ManageEmployeeAccount";
import EmployeeDash from "./Component/Employee/EmployeeDash";
import UpdateEmployeeDetails from "./Component/Employee/UpdateEmployeeDetails";
import RequestShiftSwap from "./Component/Employee/RequestShiftSwap";
import ViewRequestStatus from "./Component/Employee/ViewRequestStatus";
import ManageEmployeeShiftSwapRequest from "./Component/Manager/ManageEmployeeShiftSwapRequest";
import PasswordReset from "./Component/Admin/PasswordReset";
import ForgotPassword from "./Component/Admin/ForgotPassword";
import { ContactAdmin } from "./ContactAdmin";
import { EmpContactAdmin } from "./EmpContactAdmin";
import EmployeeLeaveApplication from "./Component/Employee/EmployeeLeaveApplication";
import EmployeeLeaveStatus from "./Component/Employee/EmployeeLeaveStatus";
import ManagerAddLeaveType from "./Component/Manager/ManagerAddLeaveType";
import ManagerEditLeaveType from "./Component/Manager/ManagerEditLeaveType";
import ManagerManageLeave from "./Component/Manager/ManagerManageLeave";
import ManagerPrintShiftSchedule from "./Component/Manager/ManagerPrintShiftSchedule";
import ManagerPrintLeaveRegister from "./Component/Manager/ManagerPrintLeaveRegister";




function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Function to handle successful login
  const handleLogin = (name) => {
    // Receive user's name as argument
    // Update the isLoggedIn state to true
    setIsLoggedIn(true);
    
    setUserName(name);// Set user's name on Login
  
  };

  // Function to handle logout
  const handleLogout = () => {
    // Update the isLoggedIn state to false
    setIsLoggedIn(false);
  };

  

  return (

    
   <div>
        
       <Router>
        <Routes>
          {/* Route for home page */}
          <Route path="/" element={<Home/>}></Route>

          {/* ======================================================================= */}
          {/* ---------------------------------Admin Section------------------------- */}
          {/* ======================================================================= */}

          {/* Route for login page of admin */}
          <Route path="/Admin/Login" element={<Login onLogin={handleLogin}/>}></Route>

           {/* Route for registration page of admin */}
           <Route path="/Admin/Register" element={<Register/>}></Route>

           {/* Router for Forget Password */}

          <Route path="/password-reset" element={<PasswordReset/>}></Route>
          <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
          

          

          {/* Route for admin dashboard page if user is logged in */}
          <Route path="/adminDashboard" element={isLoggedIn ? <AdminDash onLogin={handleLogin}/> : <Navigate to="/Admin/Login"/>} />
          

          {/* Route for admin activity in admin dashboard */}
          
          <Route path="/Home" element={<AdminDash/>} />
          <Route path="/Manage/Account" element={<ManageAdminAccount/>}></Route>
          <Route path="/Create/Manager/Account" element={<CreateManagerAccount/>}></Route> 
          <Route path="/Manage/Manager/Account" element={<ManageManagerAccount/>}></Route>
          <Route path="/Create/Employee/Account" element={<CreateEmployeeAccount/>}></Route>
          <Route path="/Manage/Employee/Account" element={<ManageEmployeeAccount/>}></Route>
          
          
          {/* =============================================================================*/}
          {/* -------------------------------Manager Section------------------------------ */}
          {/* ============================================================================ */}
         
          {/* Route for manager login */}
          <Route path="/Manager/Login" element={<ManagerLogin onLogin={handleLogin}/>}></Route>

           {/* Route for Forget Password */}

           <Route path="/Email-Js" element={<ContactAdmin/>}></Route>

          {/* Route for manager dashboard page if user is logged in */}

          <Route path='/managerDashboard' element ={isLoggedIn ? <ManagerDash userName={userName} onLogout={handleLogout} /> : <Navigate to="/Manager/Login"/>} />

   
          {/* Route for manager activity on manager dashboard */}
          <Route path="/Back" element={<ManagerDash/>} />
          <Route path="/Add/Manager/Profile" element={<ManagerEditProfile/>} />
          <Route path="/Manage/Manager/Profile" element={<ManagerProfile/>}></Route>
          <Route path="/Add/Employee/Details" element={<ManagerAddEmployee/>}></Route>
          <Route path="/Manage/Employee/Details" element={<ManagerViewEmployee/>} />
          <Route path="/Manage/Shift/Swap" element={<ManageEmployeeShiftSwapRequest/>}></Route>
          <Route path="/Add/Shift/Details" element={<ManagerAddShift/>}></Route>
          <Route path="/Create/Shift/Schedule" element={<ManagerCreateSchedule/>}></Route>
          <Route path="/Manage/Shift/Schedule" element={<ManagerViewSchedule/>}></Route>


          {/* Leave Management */}
          <Route path="/Add/Leave/Details" element ={<ManagerAddLeaveType/>}/>
          <Route path="/Edit/Leave/Details" element ={<ManagerEditLeaveType/>}/>
          <Route path="/Manage/Leave/Request" element ={<ManagerManageLeave/>}/>


          {/* Report */}
          <Route path="/Print/Shift/Schedule" element ={<ManagerPrintShiftSchedule/>}/>
          <Route path="/Print/Leave/Register" element ={<ManagerPrintLeaveRegister/>}/>


{/* ============================================================================================ */}
{/* ----------------------------------Employee Section------------------------------------------ */}
{/* ============================================================================================ */}
           {/* Route for employee login */}
          <Route path="/Employee/Login" element={<EmployeeLogin onLogin={handleLogin}/>}></Route>

          {/* Router for Forget Password */}

          <Route path="/Email" element={<EmpContactAdmin/>}></Route>

          {/* Route for employee dashboard page if user is logged in */}
          <Route path="/employeeDashboard" element={isLoggedIn ? <EmployeeDash userName={userName} onLogout={handleLogout} /> : <Navigate to="/Employee/Login" />}/>

          {/* Router for employee activity */}
          <Route path="/BackEmpDash" element={<EmployeeDash/>}></Route>
          <Route path="/Update/Employee/Details" element={<UpdateEmployeeDetails/>}></Route>
          <Route path="/Request/Shift/Swap" element={<RequestShiftSwap/>}></Route>
          <Route path="/View/Request/Status" element={<ViewRequestStatus/>}></Route>
          <Route path="/Request/Leave" element={<EmployeeLeaveApplication/>}></Route>
          <Route path="/View/Leave/Request" element={<EmployeeLeaveStatus/>}></Route>
        </Routes>
       </Router>
      {/*==================================================================================  */}
      {/* ------------------------------------The End--------------------------------------- */}
      {/* ================================================================================== */}

    </div>
  );
}

export default App;
