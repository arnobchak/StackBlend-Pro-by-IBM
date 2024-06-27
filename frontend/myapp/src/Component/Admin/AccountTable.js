import React, { useState, useEffect }  from 'react';
import "./AccountTable.css"
import axios from 'axios';



const AccountTable = () => {

  const [topMargin, setTopMargin] = useState(0);
  const [leftMargin, setLeftMargin] = useState(0);
  const [user, setUser] = useState([]);

  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  


  useEffect(() => {
    const registerHeight = document.querySelector('.employeeTableContainer').clientHeight;
    const viewportHeight = window.innerHeight;
    const margin = (viewportHeight - registerHeight) / 12;
    setTopMargin(margin);

    const registerWidth = document.querySelector('.employeeTableContainer').clientWidth;
    const viewportWidth = window.innerWidth;
    const margin2 = (viewportWidth - registerWidth)/2;
    setLeftMargin(margin2);

  }, []);


  useEffect(() => {
    axios.get("http://localhost:5000/Account")
      .then(res => setUser(res.data))
      .catch(err => console.log(err))
  }, [])


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = user.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

 

  return (
    <div>
          
      <div className='employeeTable'>
      
        <div className='employeeTableContainer'style={{ marginTop: `${topMargin}px`, marginLeft: `${leftMargin}px` }}>
        <h4 style={{ textAlign: "center", color: "grey" }}>Manager/Employee Account</h4>
          <table className="table table-bordered border-primary">
            <thead className="table-light">
              <tr>
              
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Role</th>
            
              </tr>
            </thead>

            <tbody>
              {currentItems.map( (val , index, arr) => { return (
                <tr key={val._id}>
                
                <td style={{ textAlign: "center" }}>{val.name}</td>
                <td style={{ textAlign: "center" }}>{val.email}</td>
                <td style={{ textAlign: "center" }}>{val.role}</td>
                
              </tr>
              )
                  

              })

              }

            </tbody>
      </table>

            <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(user.length / itemsPerPage) }).map((_, index) => (
              <li key={index} className="page-item">
                <button onClick={() => paginate(index + 1)} className='page-link'>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        

      </div>
      
      </div>

     
      
    </div>
  );
};

export default AccountTable;
