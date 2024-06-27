import React, { useState, useEffect } from 'react';
import './ViewManagerProfile.css';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const ViewManagerProfile = () => {
  const [userName, setUserName] = useState('');
  const [manager, setManager] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateManagerMobile, setUpdateManagerMobile] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/GetManagerProfileData")
      .then(res => {
        const filteredData = res.data.filter(manager => manager.mgrName === userName);
        setManager(filteredData);
      })
      .catch(err => console.log(err));
  }, [userName]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const handleEdit = (_id) => {
    axios.get(`http://localhost:5000/GetManagerProfileById/${_id}`)
      .then(res => {
        setUpdateManagerMobile(res.data.mgrMobile);
      })
      .catch(err => console.log(err));
    setEditId(_id);
  }

  const handleUpdate = () => {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(updateManagerMobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    axios.put(`http://localhost:5000/UpdateManagerProfile/${editId}`, { mgrMobile: updateManagerMobile })
      .then(res => {
        alert(res.data.message);
        window.location.reload();
        setEditId(-1);
      })
      .catch(err => {
        if (err.response) {
          alert(err.response.data.message);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log('Error', err.message);
        }
      });
  };

  const handleDelete = (_id) => {
    if (window.confirm("Do you want to delete this manager?")) {
      axios.delete(`http://localhost:5000/DeleteManagerProfile/${_id}`)
        .then(res => {
          console.log(res.data.message);
          window.location.reload();
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <div>
      <h4 style={{ textAlign: "center", color: "blue", marginTop: "50px" }}>
        Manager Details
      </h4>
      <div className='employeeTable'>
        <div className='viewEmployeeTableContainer'>
          <table className="table table-bordered border-primary">
            <thead className="table-light">
              <tr>
                <th style={{ textAlign: "center" }}>Name</th>
                <th style={{ textAlign: "center" }}>Email</th>
                <th style={{ textAlign: "center" }}>Mobile</th>
                <th style={{ textAlign: "center" }}>Date of Birth</th>
                <th style={{ textAlign: "center" }}>Date of Joining</th>
                <th colSpan={2} style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {manager.map((val) => (
                val._id === editId ? (
                  <tr key={val._id}>
                    <td>{val.mgrName}</td>
                    <td>{val.mgrEmail}</td>
                    <td>
                      <input type="text" className="form-control" value={updateManagerMobile} onChange={e => setUpdateManagerMobile(e.target.value)} />
                    </td>
                    <td>{val.mgrDob}</td>
                    <td>{val.mgrDoj}</td>
                    <td colSpan={2}>
                      <button style={{ width: "100%" }} className='btn btn-primary' onClick={handleUpdate}>Update</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={val._id}>
                    <td style={{ textAlign: "center" }}>{val.mgrName}</td>
                    <td style={{ textAlign: "center" }}>{val.mgrEmail}</td>
                    <td style={{ textAlign: "center" }}>{val.mgrMobile}</td>
                    <td style={{ textAlign: "center" }}>{formatDate(val.mgrDob)}</td>
                    <td style={{ textAlign: "center" }}>{formatDate(val.mgrDoj)}</td>
                    <td>
                      <button className='btn btn-success' onClick={() => handleEdit(val._id)}>
                        <FaEdit /> Edit
                      </button>
                    </td>
                    <td>
                      <button className='btn btn-danger' onClick={() => handleDelete(val._id)}>
                        <MdDelete /> Delete
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewManagerProfile;
