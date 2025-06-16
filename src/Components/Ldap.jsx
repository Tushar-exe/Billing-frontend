import React, { useState } from 'react';
import '../Custom_css/Ldap.css';
import '../Custom_css/Loading-overlay.css';


const Ldap = () => {
  const [displayName, setDisplayName] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [gender, setGender] = useState('');
  const [mob_no, setMobNo] = useState('');
  const [institute, setInstitute] = useState('');
  const [dept, setDept] = useState('');
  const [desg, setDesg] = useState('');
  const [domain, setDomain] = useState('');
  const [sub_domain, setSubDomain] = useState('');
  const [app, setApp] = useState('');
  const [proj_name, setProjName] = useState('');
  const [pi, setPi] = useState('');
  const [amt, setAmt] = useState('');
  const [fund, setFund] = useState('');
  const [cpu, setCpu] = useState('');
  const [gpu, setGpu] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const base_url = `http://192.168.200.131:8520`


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      displayName, userName, userEmail, organization, gender,
      mob_no: parseInt(mob_no), institute, dept, desg, domain, sub_domain, app,
      proj_name, pi, amt: parseInt(amt), fund, cpu: parseInt(cpu), gpu: parseInt(gpu), startDate, endDate,
      address, description
      // ldapPassword
    };
    console.log('Form Submitted:', formData);
    const url = `${base_url}/ldap/add/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.message === 'User already exists in LDAP') {
        alert('User already exists in LDAP');
      } else if (result.message === 'User added successfully to LDAP') {
        alert('User created successfully in LDAP');
      }
      else {
        alert('Error occured in adding user In LDAP');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }

  };

  const handlePreview = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };



  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <div className="text-white mt-2">Processing... Please wait</div>
        </div>
      )}
      <div className="container mt-5 mb-5 me-2">
        <form onSubmit={handleSubmit}>
          <div className="row shadow p-4" style={{ background: '#fff', borderRadius: '8px' }}>
            <h2 className="text-center mb-4">ADD USER TO LDAP</h2>
            {/* Left Column */}
            <div className="col-md-6 border-end fade-in-left">


              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Display Name:</label>
                <input type="text" value={displayName} className="form-control" onChange={(e) => setDisplayName(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">User Name:</label>
                <input type="text" value={userName} className="form-control" onChange={(e) => setUserName(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Email Id:</label>
                <input type="email" value={userEmail} className="form-control" onChange={(e) => setUserEmail(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Organization:</label>
                <input type="text" value={organization} className="form-control" onChange={(e) => setOrganization(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Gender:</label>
                <label>
                  <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} required /> Male
                </label>
                <label className="ms-2">
                  <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} /> Female
                </label>
                <label className="ms-2">
                  <input type="radio" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} /> Other
                </label>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Mobile No:</label>
                <input type="number" value={mob_no} className="form-control" onChange={(e) => setMobNo(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Institute:</label>
                <input type="text" value={institute} className="form-control" onChange={(e) => setInstitute(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Department:</label>
                <input type="text" value={dept} className="form-control" onChange={(e) => setDept(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Designation:</label>
                <input type="text" value={desg} className="form-control" onChange={(e) => setDesg(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Domain:</label>
                <input type="text" value={domain} className="form-control" onChange={(e) => setDomain(e.target.value)} required />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Sub Domain:</label>
                <input type="text" value={sub_domain} className="form-control" onChange={(e) => setSubDomain(e.target.value)} required />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Application:</label>
                <input type="text" value={app} className="form-control" onChange={(e) => setApp(e.target.value)} required />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6 fade-in-right">

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Project Name:</label>
                <input type="text" value={proj_name} className="form-control" onChange={(e) => setProjName(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">PI:</label>
                <input type="text" value={pi} className="form-control" onChange={(e) => setPi(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Amount:</label>
                <input type="number" value={amt} className="form-control" onChange={(e) => setAmt(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Funded:</label>
                <select value={fund} className="form-control" onChange={(e) => setFund(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">CPU Hours:</label>
                <input type="number" value={cpu} className="form-control" onChange={(e) => setCpu(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">GPU Hours:</label>
                <input type="number" value={gpu} className="form-control" onChange={(e) => setGpu(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Start Date:</label>
                <input type="date" value={startDate} className="form-control" onChange={(e) => setStartDate(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">End Date:</label>
                <input type="date" value={endDate} className="form-control" onChange={(e) => setEndDate(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Address:</label>
                <input type="text" value={address} className="form-control" onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div className="mb-3 d-flex align-items-center">
                <label className="me-3">Description:</label>
                <input type="text" value={description} className="form-control" onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-danger">Submit</button>

                <button type="button" className="btn btn-primary ms-2" onClick={handlePreview}> Preview Form</button>

              </div>
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <div className=" modal show fade d-block d-flex align-items-center " tabIndex="-1" role="dialog">
          <div className=" modal-dialog custom-modal " role="document">
            <div className="modal-content custom-content">
              <div className="modal-header d-block text-center">
                <h5 className="modal-title w-100">Form Preview</h5>
                <button type="button" className="btn-close position-absolute top-0 end-0 mt-4 me-2" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Display Name:</strong> {displayName}</p>
                <p><strong>User Name:</strong> {userName}</p>
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Organization:</strong> {organization}</p>
                <p><strong>Gender:</strong> {gender}</p>
                <p><strong>Mobile No:</strong> {mob_no}</p>
                <p><strong>Institute:</strong> {institute}</p>
                <p><strong>Department:</strong> {dept}</p>
                <p><strong>Designation:</strong> {desg}</p>
                <p><strong>Domain:</strong> {domain}</p>
                <p><strong>Sub Domain:</strong> {sub_domain}</p>
                <p><strong>Application:</strong> {app}</p>
                <p><strong>Project Name:</strong> {proj_name}</p>
                <p><strong>PI:</strong> {pi}</p>
                <p><strong>Amount:</strong> {amt}</p>
                <p><strong>Funded:</strong> {fund}</p>
                <p><strong>CPU Hrs:</strong> {cpu}</p>
                <p><strong>GPU Hrs:</strong> {gpu}</p>
                <p><strong>Start Date:</strong> {startDate}</p>
                <p><strong>End Date:</strong> {endDate}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Description:</strong> {description}</p>


              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Ldap;


