import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import "./EditLeaveType.css";
import { FaEdit } from "react-icons/fa";

const EditLeaveType = () => {
  const [shiftData, setShiftData] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateTotalDays, setUpdateTotalDays] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/leave-type-data")
      .then(res => {
        setShiftData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleEdit = (_id) => {
    axios.get(`http://localhost:5000/Edit-leave-type/${_id}`)
      .then(res => {
        setUpdateDescription(res.data.description);
        setUpdateTotalDays(res.data.totalDays);
        setUpdateStatus(res.data.status);
      })
      .catch(err => console.log(err));

    setEditId(_id);
  };

  const handleUpdate = async () => {
    if (updateTotalDays <= 0) {
      toast.error('Please enter a positive number.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/Update-leave-type/${editId}`, {
        description: updateDescription,
        totalDays: updateTotalDays,
        status: updateStatus
      });

      alert(response.data.message);
      window.location.reload();
      setEditId(-1);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }
  };

  return (
    <div className="container my-4">
      <h4 className="text-center text-primary mb-4">Leave Type Details</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th className="text-center bg-pink">Leave Name</th>
              <th className="text-center bg-pink">Description</th>
              <th className="text-center bg-pink">Total Days/Year</th>
              <th className="text-center bg-pink">Status</th>
              <th className="text-center bg-pink">Action</th>
            </tr>
          </thead>
          <tbody>
            {shiftData.map((val) => (
              val._id === editId ? (
                <tr key={val._id}>
                  <td>{val.leaveName}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={updateDescription}
                      onChange={e => setUpdateDescription(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={updateTotalDays}
                      onChange={e => setUpdateTotalDays(e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="form-control form-control-sm"
                      value={updateStatus}
                      onChange={e => setUpdateStatus(e.target.value)}
                    >
                      <option value="In-Active">In-Active</option>
                      <option value="Active">Active</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={val._id}>
                  <td className="text-center">{val.leaveName}</td>
                  <td className="text-center">{val.description}</td>
                  <td className="text-center">{val.totalDays}</td>
                  <td className="text-center">{val.status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => handleEdit(val._id)}
                    >
                      <FaEdit/> Edit
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditLeaveType;
