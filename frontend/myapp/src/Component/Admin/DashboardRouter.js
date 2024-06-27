import React, { useEffect, useState } from 'react';
import './Dashboard.css';






function DashboardRouter() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('admin'));
    if (user) {
      setUserName(user.name);
    }
  }, []);



  return (
    <div>
      
      
        <div id="navItems">
          <p> Admin Dashboard</p> 
          
          <p id="name">Welcome,{userName}!</p>{/* Display user's name */}

        </div>
        

        <div className="link">
          <div className='anchor'>
          <a href="/Home">Dashboard</a>
          <a href="/Manager/Register">Create Manager Account</a>
          <a href="/Employee/Register">Create Employee Account</a>
          <a href="/Manage/Account">Manage Manager/Employee Account</a>
          <a href="/Admin/Account">Manage Admin Account</a>


        </div>

        
          

        <div >
          <a  id="logout" href="/Admin/Login">Log out</a>
        </div>
          
        </div>

    
      

        
        
      
    </div>
  );  
}

export default DashboardRouter;
