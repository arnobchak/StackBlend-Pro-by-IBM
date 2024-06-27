import React, { useState, useEffect } from 'react';
import ViewSchedule from './ViewSchedule';
import "./EmployeeDash.css"
import { BiLogOutCircle } from "react-icons/bi";
import Chart from '../Manager/Chart';
import axios from 'axios';
import { BsFillGrid3X3GapFill, BsPeopleFill} from 'react-icons/bs';
import logo from '../Admin/sbprowhite.png';





const EmployeeDash = () => {
  const[totalShift, setTotalShift] = useState(0);
  
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [leave, setLeave] = useState(0);
  
  

  useEffect(() => {
    axios.get("http://localhost:5000/EmployeeAccountOnRoll")
      .then(res => {
        
        setTotalEmployees(res.data.length);
      })
      .catch(err => console.log(err))
  }, []);

 

  useEffect(() => {
    axios.get("http://localhost:5000/GetTotalShift")
      .then(res => {
        
        setTotalShift(res.data.length);
      })
      .catch(err => console.log(err))
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/approved-leaves-today')
      .then(res => {

        console.log(res.data)
        setLeave(res.data.totalApprovedLeaves);
      })
      .catch(err => console.error(err));
  }, []);


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { name: 'Employee Profile', isOpen: false, subItems: ['Update Employee Details'] },
    
    { name: 'Shift Schedule', isOpen: false, subItems: ['Request Shift Swap', 'View Request Status'] },

    { name: 'Leave', isOpen: false, subItems: ['Request Leave', 'View Leave Request'] },
    
    
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
          <button className="openBtn" onClick={toggleSidebar}>&#9776; Welcome! {userName}</button>
          
          
          
        </div>
        <div className='navItem'>
        <img id='symbol'src={logo} alt='#'/>
          
        </div>
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

        <button style={{color:'yellow', fontSize:'20px'}} className="logoutBtn" onClick={() => window.location.href = '/Employee/Login'}><BiLogOutCircle/> Logout</button>
      </div>

      <div id="main" className={isSidebarOpen ? 'shifted' : ''}/>
      
      <div id='emp-dash-chart'>
        <div className='emp-info'>
            <div className='card-info'>
                <div className='card-info-inner'>
                    <h4>EMPLOYEES</h4>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>{totalEmployees}</h1>
            </div>
            <div className='card-info'>
                <div className='card-info-inner'>
                    <h4>SHIFTS</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>{totalShift}</h1>
            </div>
            
            <div className='card-info'>
                <div className='card-info-inner'>
                <h4>LEAVE TODAY</h4>
                
                    <BsFillGrid3X3GapFill className='card_icon'/> 
                    
                </div>
                <h1>{leave}</h1>
                
            </div>

        </div>
        <Chart/>
      </div>
      <div id='emp-dash-chart'>
      <ViewSchedule/>
      </div>
      
      
      
      
    </div>
  );
};

export default EmployeeDash;
