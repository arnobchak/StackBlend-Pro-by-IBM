import React from "react";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";


const NavBar = () => {
  return (
    <div className=" bg-info-subtle">
      

      <nav className="navbar navbar-light  justify-content-between container">

        <a href="/Back" className="navbar-brand">
          <SlArrowLeft/> LEAVE MANAGEMENT SYSTEM
        </a>
        
        
      </nav>
    </div>
  );
};

export default NavBar;