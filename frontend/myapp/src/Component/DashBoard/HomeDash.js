import React, {useState,useEffect} from 'react'
import axios from 'axios';
import '../DashBoard/Dash.css';
import { GrUserManager } from "react-icons/gr";
import 
{ BsFillGrid3X3GapFill, BsPeopleFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';

function HomeDash() {
  const[totalShift, setTotalShift] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
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
    axios.get("http://localhost:5000/ManagerAccountOnRoll")
      .then(res => {
        
        setTotalManagers(res.data.length);
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

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
     

  return (
    <main className='main-container'>
        <div className='main-title'>
            
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h4>MANAGER</h4>
                    <GrUserManager className='card_icon'/>
                </div>
                <h1>{totalManagers}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>EMPLOYEES</h4>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>{totalEmployees}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h4>SHIFTS</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>{totalShift}</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                <h4>LEAVE TODAY</h4>
                
                    <BsFillGrid3X3GapFill className='card_icon'/> 
                    
                </div>
                <h1>{leave}</h1>
                
            </div>
        </div>

        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>

        </div>
    </main>
  )
}

export default HomeDash;