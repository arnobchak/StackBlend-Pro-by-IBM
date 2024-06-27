import React, { useState, useEffect } from 'react';
import './ManagerDash.css';
import { BiLogOutCircle } from "react-icons/bi";
import AddShift from '../Shift/AddShift';



const ManagerAddShift= () => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    
    { name: 'Manager Profile', isOpen: false, subItems: ['Add Manager Profile', 'Manage Manager Profile'] },
    
    { name: 'Employee', isOpen: false, subItems: ['Add Employee Details', 'Manage Employee Details', 'Manage Shift Swap'] },
    { name: 'Shift', isOpen: false, subItems: ['Add Shift Details'] },
    { name: 'Shift Schedule', isOpen: false, subItems: ['Create Shift Schedule', 'Manage Shift Schedule'] },
    { name: 'Employee Leave', isOpen: false, subItems: ['Add Leave details', 'Edit Leave Details','Manage Leave Request'] },
    { name: 'Report', isOpen: false, subItems: ['Print Shift Schedule', 'Print Leave Register'] },
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
        <button style={{cursor: 'pointer',width:'100%', fontWeight: 'bold', border: 'none', background: 'white', outline: 'none', textAlign: 'left', paddingLeft: '17px', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #ccc',}} onClick={() => window.location.href = '/Back'}>Dashboard</button>
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

        <button style={{color:'yellow', fontSize:'20px'}} className="logoutBtn" onClick={() => window.location.href = '/Manager/Login'}><BiLogOutCircle/> Logout</button>
      </div>

      <div id="main" className={isSidebarOpen ? 'shifted' : ''}>

        
      </div>

      <AddShift/>
      
      
    </div>
  );
};

export default ManagerAddShift;
