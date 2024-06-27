import React, { useState, useEffect } from 'react';
import EmployeeRegister from '../Employee/EmployeeRegister';
import { BiLogOutCircle } from "react-icons/bi";


const CreateEmployeeAccount = () => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { name: 'Admin Profile', isOpen: false, subItems: ['Manage Account'] },
    
    { name: 'Manager', isOpen: false, subItems: ['Create Manager Account', 'Manage Manager Account'] },
    
    { name: 'Employee', isOpen: false, subItems: ['Create Employee Account', 'Manage Employee Account'] },
    
  ]);
  
  const [userName, setUserName] = useState('');
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
      
    }
  }, []);

  /* Toggle the sidebar */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* Toggle the submenu */
  const toggleSubMenu = (index) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index].isOpen = !updatedMenuItems[index].isOpen;
    setMenuItems(updatedMenuItems);
  };

  return (
    <div>
      <div className="topNav">
        <div>
          <button className="openBtn" onClick={toggleSidebar}>&#9776; Welcome</button>
          
          
          
        </div>
        <div className='navItem'>
          
          
        </div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

        <div className='userNameBox'>
          <div className="user-info">
            <div className="avatar-circle">{userName.charAt(0)}</div>
            <p id="userName">{userName}</p>
          </div>
        </div>

        <div>
        <button style={{cursor: 'pointer',width:'100%', fontWeight: 'bold', border: 'none', background: 'white', outline: 'none', textAlign: 'left', paddingLeft: '17px', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ccc',}} onClick={() => window.location.href = '/Home'}>Dashboard</button>
        </div>
        
        <ul className="list-group list-group-flush">
          {menuItems.map((menuItem, index) => (
            <li key={index} className="list-group-item" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              <span onClick={() => toggleSubMenu(index)}>{menuItem.name}</span>
              {menuItem.isOpen && (
                <ul>
                  {menuItem.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="list-group-item" style={{ cursor: 'pointer' }} 
                    onClick={() => window.location.href = `/${subItem.split(' ').join('/')}`}>
                      {subItem}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <button style={{color:'yellow', fontSize:'20px'}} className="logoutBtn" onClick={() => window.location.href = '/Admin/Login'}><BiLogOutCircle/> Logout</button>
      </div>

      <div id="main" className={isSidebarOpen ? 'shifted' : ''}>

       

      </div>

      <EmployeeRegister/>
      
      
    </div>
  );
};

export default CreateEmployeeAccount;
