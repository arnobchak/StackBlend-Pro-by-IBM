import React, { useState, useEffect } from 'react';
import "./ManageLeave.css";


const ManageLeave = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { name: 'Manager Profile', isOpen: false, subItems: ['Add Manager Profile', 'Manage Manager Profile'] },
    { name: 'Employee', isOpen: false, subItems: ['Add New Employee', 'Manage Employee Details', 'Manage Shift Swap'] },
    { name: 'Shift', isOpen: false, subItems: ['Add Shift Details'] },
    { name: 'Shift Schedule', isOpen: false, subItems: ['Create Shift Schedule', 'Manage Shift Schedule'] },
    { name: 'Employee Leave', isOpen: false, subItems: ['Manage Leave'] },
  ]);
  
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubMenu = (index) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index].isOpen = !updatedMenuItems[index].isOpen;
    setMenuItems(updatedMenuItems);
  };

  return (
    <div>
      <div className="topNav">
        <div>
          <button className="openBtn" onClick={toggleSidebar}>&#9776; Welcome! {userName}</button>
          <button className="notificationBtn" onClick={() => window.location.href = '/Notification'}>&#128276;</button>
        </div>
        <div className='navItem'></div>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className='userNameBox'>
          <div className="user-info">
            <div className="avatar-circle">{userName.charAt(0)}</div>
            <p id="userName">{userName}</p>
          </div>
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

        <button className="logoutBtn" onClick={() => window.location.href = '/Manager/Login'}>&#128076; Logout</button>
      </div>

      <div id="main" className={isSidebarOpen ? 'shifted' : ''}>
        
      </div>
      
    
    </div>
  );
};

export default ManageLeave;
