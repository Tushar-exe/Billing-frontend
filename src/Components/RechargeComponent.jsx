import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RechargeComponent = () => {
    const [formData, setFormData] = useState({
        username: "",
        cpuhours:0
    });
    const base_url = process.env.REACT_APP_BACKEND_URL;

    const [users,setUsers] = useState([]);

  useEffect(() => {
      axios.get(`${base_url}/generateinvoice/getallusers/`)
      .then(response => {
        if (response.data) {
          console.log(response.data.users);
          setUsers(response.data.users); 
          // console.log(users)
         }
      })
      .catch(error => {
        toast.error("Error fetching users: " + (error.response?.data || error.message));
        setUsers([]);
      })   
  }, []);

  useEffect(() => {
    console.log("Updated users:", users);
  }, [users]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setSelectedAction("");
    setInputValue("");
  };

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
    setInputValue("");
  };
  
  const [confirm,setConfirm] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    setConfirm(true);
  } 

  const handleSubmit1 = async () => {
    // e.preventDefault();
    setLoading(true);
    let apiUrl = "";
    let payload = { username: selectedUser };
    if (selectedAction === "add_cpu_hours") {
      apiUrl = `${base_url}/api/add_cpu_hours/`;
      payload.cpu_hours = parseInt(inputValue);
    } else if (selectedAction === "add_gpu_hours") {
      apiUrl = `${base_url}/api/add_gpu_hours/`;
      payload.gpu_hours = parseInt(inputValue);
    } else if (selectedAction === "add_cpu_and_gpu_hours") {
      apiUrl = `${base_url}/api/add_cpu_and_gpu_hours/`;
      payload.hours = parseInt(inputValue);
    } else if (selectedAction === "add_billing") {
      apiUrl = `${base_url}/api/add_billing/`;
      payload.amount = parseInt(inputValue);
    }
    try {
      await axios.post(apiUrl, payload);
      toast.success("Operation successful!");
      setInputValue("");
    } catch (error) {
      // toast.error("API error: " + (error.response?.data || error.message));
            toast.error("API error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5 d-flex flex-column align-items-center mt-lg-5 mb-5">
        <h1>Recharge User</h1>
        <div className="d-flex flex-column gap-3 my-4 align-items-center">
          <select className="form-select" style={{ minWidth: 50 }} value={selectedUser} onChange={handleUserChange}>
            <option value="">Select User</option>
            {users.map((user, idx) => (
              <option key={idx} value={user}>{user}</option>
            ))}
          </select>
          <div className="d-flex flex-row gap-2 mt-4">
            <button type="button" className={`btn btn-outline-primary${selectedAction === 'add_cpu_hours' ? ' active' : ''}`} disabled={!selectedUser} onClick={() => setSelectedAction('add_cpu_hours')}>Add CPU Hours</button>
            <button type="button" className={`btn btn-outline-primary${selectedAction === 'add_gpu_hours' ? ' active' : ''}`} disabled={!selectedUser} onClick={() => setSelectedAction('add_gpu_hours')}>Add GPU Hours</button>
            <button type="button" className={`btn btn-outline-primary${selectedAction === 'add_cpu_and_gpu_hours' ? ' active' : ''}`} disabled={!selectedUser} onClick={() => setSelectedAction('add_cpu_and_gpu_hours')}>Add CPU and GPU Hours</button>
            <button type="button" className={`btn btn-outline-primary${selectedAction === 'add_billing' ? ' active' : ''}`} disabled={!selectedUser} onClick={() => setSelectedAction('add_billing')}>Add Billing</button>
          </div>
        </div>
        {selectedAction && (
          <form className="d-flex flex-row gap-2 align-items-center mb-4 mt-3" onSubmit={async (e) => {
            e.preventDefault();
            if (!selectedUser || !selectedAction || !inputValue) return;
            const actionLabel = {
              add_cpu_hours: 'CPU hours',
              add_gpu_hours: 'GPU hours',
              add_cpu_and_gpu_hours: 'CPU and GPU hours',
              add_billing: 'billing amount',
            }[selectedAction];
            // if (window.confirm(`Are you sure you want to assign ${inputValue} ${actionLabel} to ${selectedUser}?`)) {
              await handleSubmit(e);
            // }
          }}>
            
            Username : <input
              type="text"
              className="form-control"
              value={selectedUser}
              readOnly
              style={{ width: 140, background: '#f5f5f5' }}
            />
            Credit :<input
              type="number"
              className="form-control"
              placeholder={
                selectedAction === "add_billing"
                  ? "Enter amount"
                  : "Enter hours"
              }
              value={inputValue}
              onChange={handleInputChange}
              required
              min={1}
              style={{ width: 140 }}
              disabled={loading}
            />
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
      {confirm && (
        <div className='justify-content-center align-content-center' style={{zIndex:9999, position:'absolute',left:'30%',top:'40%',backgroundColor:'#acd1f5ff',height:'150px',width:'500px'}}>
          <div className="d-flex flex-column">
          
          <h4 className="justify-content-center">
               Are you sure u want to continue
          </h4>
          <br/>
          <br/>
          <div className="d-flex flex-row">
            <button className="btn btn-success" onClick={(formData)=>{handleSubmit1();setConfirm(false);}} style={{marginLeft:'25px',marginRight:'25px'}}>Proceed</button>
            <button className="btn btn-danger" onClick={()=>{setConfirm(false);}}>Cancel</button>
          </div>
          </div>
        </div>
      )

      }
    </>
  );
};

export default RechargeComponent;

