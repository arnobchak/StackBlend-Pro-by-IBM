import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import"./PrintShiftSchedule.css";
import logo from '../Manager/sbpro1.png';
import { PiPrinterLight } from "react-icons/pi";

const PrintShiftSchedule = () => {
  const componentPdf = useRef();
  const [user, setUser] = useState([]);
  

  const generatePDF = useReactToPrint({
    content: () => componentPdf.current,
    documentTitle: 'Employee Shift Schedule',
    onAfterPrint: () => alert('Data printed successfully.'),
  });

  useEffect(() => {
    axios.get("http://localhost:5000/GetAllShiftScheduleData")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  

  

  return (
    <div>
       
      <div className='shiftScheduleTable'>
        <div className='shiftScheduleTableContainer'>
          
          <div ref={componentPdf}>
          <img src={logo}alt=''></img> 
            
            <div className="report-header">
            
              <h3 style={{textAlign:'center', marginTop:'20px'}}>Employee Shift Schedule</h3>
              <p style={{textAlign:'center',fontWeight:'bold'}}>Company XYZ</p>
              <p style={{textAlign:'center',fontWeight:'bold'}}>Date: {new Date().toLocaleDateString()}</p>

            </div>
            <table className="table table-bordered border-primary">
              <thead className="table-dark">
                <tr>
                  <th style={{ textAlign: "center", color: 'black' }}>Emp Name</th>
                  <th style={{ textAlign: "center", color: 'black' }}>From Date</th>
                  <th style={{ textAlign: "center", color: 'black' }}>To Date</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Mon</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Tue</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Wed</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Thu</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Fri</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Sat</th>
                  <th style={{ textAlign: "center", color: 'black' }}>Sun</th>
                </tr>
              </thead>
              <tbody>
                {user.map((val) => (
                  <tr key={val._id}>
                    <td style={{ textAlign: "center" }}>{val.employeeId.name}</td>
                    <td style={{ textAlign: "center" }}>{formatDate(val.fromDate)}</td>
                    <td style={{ textAlign: "center" }}>{formatDate(val.toDate)}</td>
                    <td style={{ textAlign: "center", backgroundColor: val.mon === 'Off' ? 'yellow' : 'white' }}>
                      {val.mon === 'Off' ? 'Off' : (val.mon &&
                        (<div>
                          <div>{val.mon.shiftName}</div>
                          <div>({val.mon.startTime}-{val.mon.endTime})</div>
                        </div>))
                      }</td>
                    <td style={{ textAlign: "center", backgroundColor: val.tue === 'Off' ? 'yellow' : 'white' }}>
                      {val.tue === 'Off' ? 'Off' : (val.tue && (<div>
                        <div>{val.tue.shiftName}</div>
                        <div>({val.tue.startTime}-{val.tue.endTime})</div>
                      </div>))}
                    </td>
                    <td style={{ textAlign: "center", backgroundColor: val.wed === 'Off' ? 'yellow' : 'white' }}>
                      {val.wed === 'Off' ? 'Off' : (val.wed && (<div>
                        <div>{val.wed.shiftName}</div>
                        <div>({val.wed.startTime}-{val.wed.endTime})</div>
                      </div>))}
                    </td>
                    <td style={{ textAlign: "center", backgroundColor: val.thu === 'Off' ? 'yellow' : 'white' }}>
                      {val.thu === 'Off' ? 'Off' : (val.thu && (<div>
                        <div>{val.thu.shiftName}</div>
                        <div>({val.thu.startTime}-{val.thu.endTime})</div>
                      </div>))}
                    </td>
                    <td style={{ textAlign: "center", backgroundColor: val.fri === 'Off' ? 'yellow' : 'white' }}>
                      {val.fri === 'Off' ? 'Off' : (val.fri && (<div>
                        <div>{val.fri.shiftName}</div>
                        <div>({val.fri.startTime}-{val.fri.endTime})</div>
                      </div>))}
                    </td>
                    <td style={{ textAlign: "center", backgroundColor: val.sat === 'Off' ? 'yellow' : 'white' }}>
                      {val.sat === 'Off' ? 'Off' : (val.sat && (<div>
                        <div>{val.sat.shiftName}</div>
                        <div>({val.sat.startTime}-{val.sat.endTime})</div>
                      </div>))}
                    </td>
                    <td style={{ textAlign: "center", backgroundColor: val.sun === 'Off' ? 'yellow' : 'white' }}>
                      {val.sun === 'Off' ? 'Off' : (val.sun && (<div>
                        <div>{val.sun.shiftName}</div>
                        <div>({val.sun.startTime}-{val.sun.endTime})</div>
                      </div>))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            
          </div>

          <div className='d-grid d-md-flex justify-content-md-end mb-3'>
            <button className='btn btn-success' onClick={generatePDF}><PiPrinterLight/> Print</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PrintShiftSchedule;
