import {useEffect,useState} from 'react';
import axios from 'axios';

import {PieChart,Pie,Tooltip } from 'recharts';

const Chart=()=> {

  const [totalManagers, setTotalManagers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/EmployeeAccountOnRoll")
      .then(res => {
        
        setTotalEmployees(res.data.length);
      })
      .catch(err => console.log(err))
  }, []);

  // ================================================================================================

  useEffect(() => {
    axios.get("http://localhost:5000/ManagerAccountOnRoll")
      .then(res => {
        
        setTotalManagers(res.data.length);
      })
      .catch(err => console.log(err))
  }, []);

  const data=[
    {name:'Manager', value:totalManagers},
    {name:'Employee', value:totalEmployees},
  ]
  

    return(

    <div>

      <h1 style={{textAlign:'center'}}> User Pie Chart</h1>
      <PieChart width={400} height={400}>
      <Pie 
      dataKey='value'
      isAnimationActive={false}
      data={data}
      cx={200} 
      cy={200} 
      outerRadius={150} 
      fill="#660066" 
      label
    />
          
  <Tooltip/>
  </PieChart>
      



</div>
)
}








export default Chart;