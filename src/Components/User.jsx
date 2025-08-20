import React, { useState, useEffect } from 'react';
import errorImage from '../Assets/image2.png';
import '../App.css';
import Pagination from '../Components/Pagination';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, Trash2 } from 'react-bootstrap-icons'; // Bootstrap icons

const User = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUser, setShowUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteuser, setDeleteuser] = useState(false);
  const [deletinguser, setDeletinguser] = useState(null);

  const itemsPerPage = 10;
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    if (showUser) {
      showUsers();
    } else {
      showAllUsers();
    }
  }, [showUser]);

  const showUsers = () => {
    const url = `${base_url}/slurm/user/`;
    fetch(url, {
      method: "GET",
      headers: { Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  const showAllUsers = () => {
    const url = `${base_url}/slurm/user/?task=show_all`;
    fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  const handleShowUser = () => setShowUser(!showUser);

  const handleSearch = () => {
    const query = searchQuery.replace(/\s+/g, '').toLowerCase();
    const result = data?.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().replace(/\s+/g, '').toLowerCase().includes(query)
      )
    );
    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    let order = sortOrder === 'asc' ? 'desc' : 'asc';
    if (sortColumn !== column) order = 'asc';
    setSortColumn(column);
    setSortOrder(order);

    const sorted = [...filteredData].sort((a, b) => {
      const valA = a[column]?.toString().toLowerCase() || '';
      const valB = b[column]?.toString().toLowerCase() || '';
      return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    setFilteredData(sorted);
  };

  const renderSortIcons = (column) =>
    sortColumn === column ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅';

  const paginatedData = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  function handleDelete(item) {
    setDeleteuser(true);
    setDeletinguser(item);
  }

  function handleDeleteUser() {
    toast.error("User Deleted");
    setDeleteuser(false);
    setDeletinguser(null);
  }

  function handleCancelDeletion() {
    setDeleteuser(false);
    setDeletinguser(null);
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container text-center">
        <img src={errorImage} alt="Error" className="error-image" />
        <h3 className="text-danger">Oops! Something went wrong...</h3>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-2">
        <h1 className="mb-4 mt-5 text-center">
          {showUser ? 'Active Users' : 'All Users'}
        </h1>

        {/* Top Controls */}
        <div className='d-flex justify-content-between mb-3'>
          <div className='d-flex'>
            <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>Back</button>
            <button className="btn btn-info me-2" onClick={handleShowUser}>
              {showUser ? 'Show All Users' : 'Show Active Users'}
            </button>
            <button className="btn btn-info" onClick={() => navigate('/slurm/user_form')}>
              Add Existing Ldap User to Slurm
            </button>
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Sr No</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Name {renderSortIcons('name')}</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('account')}>Account {renderSortIcons('account')}</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('qos')}>QOS {renderSortIcons('qos')}</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('creation_time')}>Creation Time {renderSortIcons('creation_time')}</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('mod_time')}>Last Modified {renderSortIcons('mod_time')}</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('deleted')}>Status {renderSortIcons('deleted')}</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">No users found</td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td><strong>{item.name}</strong></td>
                    <td >
                      {item.account_qos.map((entry, i) => (
                        <span key={i} className="badge bg-secondary text-truncate me-1"
                          style={{
                            flex: '0 0 calc(64.444% - 0.25rem)',
                            textAlign: 'center'
                          }}>{entry.acct}</span>
                      ))}
                    </td>
                    <td>
                      {item.account_qos.map((entry, i) => (
                        <span key={i} className="badge bg-secondary me-1 border">{entry.qos.join(', ')}</span>
                      ))}
                    </td>
                    <td className="text-muted small">{new Date(item.creation_time).toLocaleString()}</td>
                    <td className="text-muted small">{new Date(item.mod_time).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${item.deleted ? 'bg-danger' : 'bg-success'}`}>
                        {item.deleted ? 'Deleted' : 'Active'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-1"
                        title="View Details"
                        disabled={item.deleted}
                        onClick={() => handleShowDetails(item)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        title="Delete User"
                        disabled={item.deleted}
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Details Modal */}
      {showModal && selectedUser && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(113, 142, 236, 0.5)' }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details - {selectedUser.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p className='d-flex justify-content-between flex-wrap'><strong>Name:</strong> {selectedUser.name}</p>
                <p className='d-flex justify-content-between flex-wrap'><strong>Creation Time:</strong> {new Date(selectedUser.creation_time).toLocaleString()}</p>
                <p className='d-flex justify-content-between flex-wrap'><strong>Last Modified:</strong> {new Date(selectedUser.mod_time).toLocaleString()}</p>
                <p className='d-flex justify-content-between flex-wrap'><strong>Accounts & QOS:</strong></p>
                <ul>
                  {selectedUser.account_qos.map((entry, index) => (
                    <li key={index}>
                      <div className='d-flex justify-content-between flex-wrap'>
                        <span ><strong>Account:</strong> </span><span>{entry.acct}</span>
                      </div>
                      <div className='d-flex justify-content-between flex-wrap'>
                        <span ><strong>QOS:</strong></span><span> {entry.qos.join(', ')}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteuser && deletinguser && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(113, 142, 236, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title text-danger">Do you want to delete this user? Click 'Confirm' to continue.</h6>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {deletinguser.name}</p>
                <p><strong>Creation Time:</strong> {new Date(deletinguser.creation_time).toLocaleString()}</p>
                <p><strong>Last Modified:</strong> {new Date(deletinguser.mod_time).toLocaleString()}</p>
                <p><strong>Accounts & QOS:</strong></p>
                <ul>
                  {deletinguser.account_qos.map((entry, index) => (
                    <li key={index}>
                      <strong>Account:</strong> {entry.acct} <br />
                      <strong>QOS:</strong> {entry.qos.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDeletion}>Cancel</button>
                <button onClick={handleDeleteUser} className="btn btn-danger">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default User; 
