import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Custom_css/User_Form.css'; // Assuming you have custom styles here


const UserForm = () => {
  const [uids, setUids] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [qos, setQos] = useState([]);
  const [formData, setFormData] = useState({
    uid: '',
    account: '',
    qos: ''
  });
  const navigate = useNavigate();

  const base_url = 'http://192.168.200.131:8520';
  useEffect(() => {
    const url =`${base_url}/slurm/ldap_list/`
    fetch(url,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setUids(data.users.filter(user => user.uid));
        setAccounts(data.accounts || []);
        setQos(data.qos.filter(qos =>qos.name));
        console.log("Fetched data:", data);
      })
      .catch(error => {
        alert("Failed to fetch data.");
        console.error('Error fetching UID/account list:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const post_url=`${base_url}/slurm/user/add/`;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  
    try {
      const response = await fetch(post_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('User added successfully in SLURM');
        console.log("Server response:", result);
        navigate('/users_list'); 
      } else {
        alert('Error occurred while adding user in SLURM');
        console.error("Error response from server:", result);
      }
  
    } catch (error) {
      console.error('Error submitting form:', error);

    }
  };
  
  return (
    <>
    <div className='container'>
    <div className="row justify-content-center  animate-fade-in-up custom-height">
      <div className="col-12 col-md-6 p-4 border rounded bg-light  form_div">
        <h1 className="mb-4 text-center">Add LDAP User to Slurm</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="form-label">UserName:</label>
            <select
              required
              id="uid"
              name="uid"
              className="form-control"
              value={formData.uid}
              onChange={handleChange}
            >
              <option value="">Select from Ldap User List </option>
              {uids.length > 0 ? (
                uids.map((user, index) => (
                  <option key={index} value={user.uid}>{user.uid}</option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>

          <div className="mb-5">
            <label  className="form-label">Account:</label>
            <select
              required
              id="account"
              name="account"
              className="form-control"
              value={formData.account}
              onChange={handleChange}
            >
              <option value="">Select from Existing Accounts</option>
              {accounts.length > 0 ? (
                accounts.map((acct, index) => (
                  <option key={index} value={acct}>{acct}</option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>
              <br />
          <div className="d-flex justify-content-center mt-5">
            <button type="submit" className="btn btn-primary w-50">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>
  ); 
};

export default UserForm;
