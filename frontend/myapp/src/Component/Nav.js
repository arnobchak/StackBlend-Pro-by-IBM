import React from 'react'
import { Link } from 'react-router-dom';
import Symbol from '../Assets/sb2light.png';
import './Nav.css';



function Nav() {
  return (
    <div>
      <div className="nav-header">
      
        <img id ="logo" src={Symbol} alt=""/>
    
      
          <ul class="nav nav-underline">
          
          <li class="nav-item">
            <Link class="nav-link" to="/Admin/Login">Admin</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/Manager/Login">Manager</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/Employee/Login" style={{marginRight:'100px'}}>Employee</Link>
          </li>
          </ul>
        
    
       
             
      </div>
    </div>
  )
}

export default Nav;