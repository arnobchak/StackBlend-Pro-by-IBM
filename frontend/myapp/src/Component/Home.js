import React from 'react';
import "./Home.css";
import logo from '../Assets/free hand.jpg';
import Nav from './Nav';

function Home() {

  return(

    

    <div >
      <Nav/>
      
      
      
      <body className="bodyHome">
        
        <div id="text">

          <p>"Your work schedule,<br></br>your way. <br></br>Our HR management tools<br></br> put you in control".</p>

    
        </div>

        <div id="image" >

        <img src={logo} alt=""/>
        

        </div>


      </body>


    


      <footer>
      <div className='Footer bg-dark d-flex justify-content-end align-items-center py-3' style={{ position: 'relative', bottom: '0', width: '100%', height: '100px',padding: '50px'}}>
      <p className="text-white">© 2024 Stackblend Pro by Arnob Chakraborty.<br/> All Rights Reserved</p>
      </div>


      </footer>

    
      
      
               
    </div>
  )
}

export default Home;
