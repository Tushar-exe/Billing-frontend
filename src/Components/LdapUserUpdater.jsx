import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Card, Pagination } from "react-bootstrap";
import errorImage from '../Assets/image2.png';
import editIcon from '../Assets/editIcon.jpg';  // Import edit icon properly
import { useNavigate } from "react-router-dom";
//import user_img from '../Assets/user.jpg';
const LdapUserUpdater = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(null);
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  const [dataPresent, setDataPresent] = useState(true);

  const usersPerPage = 4;
  // const base_url = 'http://10.208.22.180:8520';
  const base_url = "http://10.208.23.139:8520";
  useEffect(() => {
    fetch(`${base_url}/ldap`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(data => {
        console.log(data.data)
        setUsers(data.data);
        setFilteredData(data.data)
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
    setIsEditMode(false);
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm(user);
    setIsEditMode(true);
    setModalVisible(true);
  };
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving data...', editForm);
    setModalVisible(false);
  };

  // const handleSearch = ()=>{
  //   console.log(search)
  //   setFilteredData(prev => prev.filter(user=>user.uid === search))
  //   console.log(filteredData)
  // }

  const handleSearch = () => {
    if (!search || search.trim() === "") {
      setDataPresent(true)
      setFilteredData(users);
    } else {
      const lowerSearch = search.trim().toLowerCase();
      const filtered = users.filter(user => user.uid.toLowerCase().includes(lowerSearch));
      if (filtered.length !== 0) {
        setDataPresent(true);
      }
      else {
        setDataPresent(false)
      }
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  // const totalPages = Math.ceil(users.length / usersPerPage);
  const currentUsers = filteredData ? filteredData.slice(indexOfFirstUser, indexOfLastUser) : [];
  const totalPages = Math.ceil((filteredData ? filteredData.length : 0) / usersPerPage);
  console.log(indexOfFirstUser, indexOfLastUser)
  const handlePageChange = (number) => setCurrentPage(number);
  return (
    <div className="mt-4">
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Processing... Please wait</div>
        </div>
      )}
      {error && (
        <div className="text-center mt-5">
          <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
          <h4 className="text-danger">Oops! Something went wrong...</h4>
          <p className="text-muted">An unexpected error occurred while fetching data.</p>
        </div>
      )}
      {!loading && !error && (
        <div>
          <br />

          <div className="d-flex flex-row justify-content-between align-items-center mt-5 mb-4 px-4">
            <div className="d-flex flex-row" style={{ cursor: 'pointer', position: 'absolute', top: '25%', left: '18%' }}>
              <button className="btn btn-primary" onClick={() => {
                navigate(-1);
              }}>Back</button>
            </div>
            <div style={{ left: '50%', width: '33%' }}></div> {/* Left spacer */}
            <h2 className="text-center mb-0" style={{ color: 'black', width: '33%' }}>
              <strong>LIST OF LDAP USERS</strong>
            </h2>


            <div className="d-flex justify-content-end" style={{ width: '33%' }}>
              <input
                id='search'
                className="form-control me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search UID"
                style={{ borderRadius: '15px', width: '180px' }}
              />
              <button className="btn btn-primary" onClick={handleSearch}>Search</button>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center ms-5 mt-5">
            {!dataPresent ? (<h4 className="fw-bold text-danger">NO SUCH DATA FOUND</h4>) :currentUsers.map((user) => (
              <Card key={user.uid} style={{ width: '30rem', height: '35rem', margin: '10px', backgroundColor: 'rgb(254, 254, 254)' }}>
                <Card.Header className='d-flex flex-wrap justify-content-center bg-dark text-white' style={{}}>
                  <div className='d-flex flex-wrap justify-content-center' style={{ height: '50%', width: '50%', position: 'relative' }}>
                    <Card.Title className="text-center">{user.uid.toUpperCase()}</Card.Title>
                  </div>
                </Card.Header>
                <div className='d-flex flex-column align-items-center'>
                  <Card.Body style={{ maxHeight: '60%', overflowY: 'auto', width: '100%', overflowX: 'auto' }}>
                    <div className="d-flex">
                      <br />
                      <br /><br />
                      <h5><strong>User Data:</strong></h5>
                      <span onClick={() => handleEdit(user)}>
                        <img src={editIcon} alt="edit icon" style={{ height: '30px', width: '30px', position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} />
                      </span>

                    </div>
                    <Card.Text >
                      <pre className='d-flex flex-column' style={{ fontFamily: 'monospace', fontSize: '1rem', overflowX: 'hidden' }}>
                        <Card.Subtitle className="mb-2 text-muted"><b><strong></strong>CN             : {user.uid}</b></Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted"><b>UID            : {user.uid}</b></Card.Subtitle>
                        <strong>DN             : {user.dn}</strong>
                        <strong>Uid Number     : {user.uidNumber}</strong>
                        <strong>GidNumber      : {user.gidNumber}</strong>
                        <strong>Home Directory : {user.homeDirectory}</strong>
                        <strong>Login Shell    : {user.loginShell}</strong>
                        <strong>Email          : {user.mail}</strong>
                        <strong>Given Name     : {user.givenName}</strong>
                        <strong>SN             : {user.sn}</strong>
                        <strong>objectClass    : {user.objectClass.map((type, index) => {
                          return <h6><b>                 - {type}</b></h6>
                        })}</strong>
                      </pre>
                      <h3>--------------------------------------</h3>
                    </Card.Text>
                    <h5>
                      <strong>Group Data:</strong>
                    </h5>
                    <pre>
                      {user.group && user.group.gidNumber ? (
                        <h6 className="">
                          <strong>GID NUMBER     : {user.group.gidNumber}</strong>
                        </h6>
                      ) : <h6 style={{ color: 'red' }}>
                        <strong>Group data is not present as UID and GID do not match.</strong>
                      </h6>}
                      {user.group && user.group.cn && (
                        <h6 className="">
                          <strong>CN             : {user.group.cn}</strong>
                        </h6>
                      )}
                      {user.group && user.group.dn && (
                        <h6 className="">
                          <strong>DN             : {user.group.dn}</strong>
                        </h6>
                      )}
                    </pre>
                  </Card.Body>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div
        className="d-flex justify-content-center align-items-center mt-4"
        style={{
          overflowX: 'auto',
        }}
      >
        <Pagination className="d-flex justify-content-center align-items-center">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages).keys()].map(num => (
            <Pagination.Item
              style={{ overflowX: 'auto' }}
              key={num + 1}
              active={currentPage === num + 1}
              onClick={() => handlePageChange(num + 1)}
              className="d-flex justify-content-center"
            >
              {num + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>

      <Modal show={modalVisible} onHide={() => setModalVisible(false)} centered style={{ width: '100%', height: '100%', }}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit User" : "User Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {selectedUser && isEditMode && (
            <Form>
              <Form.Group>
                <Form.Label>UID</Form.Label>
                <Form.Control type="text" name="uid" value={editForm.uid || ''} onChange={handleChange} disabled />
              </Form.Group>
              <Form.Group>
                <Form.Label>UID Number</Form.Label>
                <Form.Control type="text" name="uidNumber" value={editForm.uidNumber} />
              </Form.Group>
              <Form.Group>
                <Form.Label>CN</Form.Label>
                <Form.Control type="text" name="cn" value={editForm.cn || ''} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="mail" value={editForm.mail} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>GidNumber</Form.Label>
                <Form.Control type="email" name="mail" value={editForm.group.gidNumber} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Dn</Form.Label>
                <Form.Control type="email" name="mail" value={editForm.group.dn} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Dn</Form.Label>
                <Form.Control type="email" name="mail" value={editForm.group.dn} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Dn</Form.Label>
                <Form.Control type="email" name="mail" value={editForm.group.dn} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Dn</Form.Label>
                <Form.Control type="email" name="mail" value={editForm.group.dn} onChange={handleChange} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: 'red' }} onClick={() => setModalVisible(false)}>Close</Button>
          {isEditMode && <Button variant="primary" onClick={handleSave}>Save Changes</Button>}
        </Modal.Footer>
      </Modal>

    </div>
  );
};
export default LdapUserUpdater;