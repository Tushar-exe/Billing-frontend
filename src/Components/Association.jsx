import React, { useState, useEffect } from 'react';
import '../App.css'; // Your CSS file
import errorImage from '../Assets/image2.png';
import successImage from '../Assets/success.png';
import Pagination from './Pagination'; // Import the Pagination component
import { useNavigate } from 'react-router-dom';

const Association = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalMessage, setModalMessage] = useState('');
  const [modalImage, setModalImage] = useState('');
  const [modalData, setModalData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActiveSlurm, setShowSlurm] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [updateModalData, setUpdateModalData] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [qos, setQos] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    qos: '',
    uid: '',
    account: '',
  });
  const itemsPerPage = 10; // Number of records per page

  //const base_url=`http://192.168.200.131:8080`
  //const base_url=`http://10.208.34.9:9000`
  // const base_url = `http://paramrudra.pune.cdac.in:8520`
    const base_url = process.env.REACT_APP_BACKEND_URL;


  // Fetch data for Active Associations
  const fetchActiveAssociations = () => {
    const url = `${base_url}/slurm/assoc/`;

    fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        setData(jsonData);
        setFilteredData(jsonData.assocs);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  // Fetch data for All Associations
  const fetchAllAssociations = () => {
    const url = `${base_url}/slurm/assoc/?task=show_all`;
    fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        setData(jsonData);
        setFilteredData(jsonData.assocs);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching all associations');
        setLoading(false);
      });
  };


  // Fetch data based on the view (active or all associations)
  useEffect(() => {
    setLoading(true); // Reset loading state before fetching
    if (showActiveSlurm) {
      fetchActiveAssociations();
    } else {
      fetchAllAssociations();
    }
  }, [showActiveSlurm]);

  useEffect(() => {
    const fetchQosData = async () => {
      try {
        const response = await fetch(`${base_url}/slurm/ldap_list/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setQos((data.qos || []).filter(q => q.name));
      } catch (err) {
        console.error('Error fetching QOS data:', err);
      }
    };

    fetchQosData();
  }, []);


  const handleShowSlurm = () => {
    setShowSlurm(!showActiveSlurm);
  };

  const handleSearch = () => {
    const query = searchQuery.replace(/\s+/g, '').toLowerCase();
    const result = data?.assocs.filter((item) =>
      Object.values(item).some((value) =>
        value && value.toString().replace(/\s+/g, '').toLowerCase().includes(query)
      )
    );
    setFilteredData(result);
    setCurrentPage(1); // Reset to the first page after search
  };

  const handleSort = (column) => {
    let order = sortOrder;
    if (sortColumn === column) {
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      order = 'asc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a[column] ? a[column].toString().toLowerCase() : '';
      const valueB = b[column] ? b[column].toString().toLowerCase() : '';
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  const handleDelete = (id) => {
    //const url = `${base_url}/slurm/assoc/${id}`;
    const url = false;
    fetch(url, {
      method: 'DELETE',
    })
      // .then((response) => {
      //   if (!response.ok) {
      //     throw new Error('Failed to delete item');
      //   }
      //   return response.json();
      // })
      .then(() => {
        setModalMessage('Item deleted successfully!');
        setModalImage(successImage);
        setShowSuccessModal(true);
        setShowDetailsModal(false);
        const updatedData = filteredData.filter(item => item.id_assoc !== id);
        setFilteredData(updatedData);
      })
      .catch((error) => {
        setModalMessage(`Error: Failed to delete data`);
        setModalImage(errorImage);
        setShowSuccessModal(true);
        setShowDetailsModal(false);
      });
  };

  const openDetailsModal = (item) => {
    setModalData(item);
    setShowDetailsModal(true);
    setShowSuccessModal(false);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowDetailsModal(false);
    setModalMessage('');
    setModalImage('');
    setShowUpdateModal(false);
  };

  const updateModal = (data) => {
    console.log('update modal button click');
    console.log(data);
    setUpdateModalData(data);
    let qosValue = data.qos;
    if (Array.isArray(qosValue)) {
    qosValue = qosValue[0];
  }
    setFormData({
    qos: qosValue || '',
    uid: data.user || '',       // assuming uid corresponds to user
    account: data.acct || '',
     });
    setShowUpdateModal(true);
    setShowUpdateModal(true);
    setShowDetailsModal(false);


  }



  const renderSortIcons = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '▲▼';
  };

  // Calculate the data to display for the current page
  const paginatedData = filteredData
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // Pagination controls
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
      <div className="error-container">
        <img src={errorImage} alt="Error" className="error-image" />
        <h3 className="text-danger">Oops! Something went wrong...</h3>
        <p className="text-muted">{error || "An unexpected error occurred while fetching data."}</p>
      </div>
    );
  }

  const handleUpdateSubmit = async () => { 
    alert(JSON.stringify(formData));
  try {
    const response = await fetch(`${base_url}/slurm/assoc/associate-qos/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to update record');
    }

    const updated = await response.json();
    setModalMessage('Association updated successfully!');
    setModalImage(successImage);
    setShowSuccessModal(true);
    setShowUpdateModal(false);

    // Optional: update UI state here
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div>
      <div className="container mt-4">
        <h1 className="mb-4 mt-5 d-flex justify-content-center">
          {showActiveSlurm ? 'Active Associations' : 'All Associations'}
        </h1>

      <div className='d-flex flex-row justify-content-between'>
      <div className='d-flex flex-row justify-content-start'>
        <div className="d-flex flex-row mb-3">
          <button className="btn btn-primary" onClick={() => {
              navigate(-1);
            }}>Back</button>
        </div>

        {/* Toggle Button */}
        <div className="toggle-button mb-3 ms-2">
          <button
            className="btn btn-info me-2"
            onClick={handleShowSlurm} // Toggle between Active Associations and All Associations
          >
            {showActiveSlurm ? 'Show All Associations' : 'Show Active Associations'}
          </button>
        </div>
        </div>

        {/* Search Box */}
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            className="form-control w-auto me-2"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

      </div>

        {/* Table Display */}
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Sr No</th>
              <th onClick={() => handleSort('user')} style={{ cursor: 'pointer' }}>
                User
                <span>{renderSortIcons('user')}</span>
              </th>
              <th onClick={() => handleSort('acct')} style={{ cursor: 'pointer' }}>
                Account
                <span>{renderSortIcons('acct')}</span>
              </th>
              <th onClick={() => handleSort('qos')} style={{ cursor: 'pointer' }}>
                QOS
                <span>{renderSortIcons('qos')}</span>
              </th>
              <th onClick={() => handleSort('creation_time')} style={{ cursor: 'pointer' }}>
                Creation Time
                <span>{renderSortIcons('creation_time')}</span>
              </th>
              <th onClick={() => handleSort('mod_time')} style={{ cursor: 'pointer' }}>
                Last Modified
                <span>{renderSortIcons('mod_time')}</span>
              </th>
              <th onClick={() => handleSort('deleted')} style={{ cursor: 'pointer' }}>
                Deleted
                <span>{renderSortIcons('deleted')}</span>
              </th>
              
              <th onClick={() => handleSort('is_def')} style={{ cursor: 'pointer' }}>
                Default Association
                <span>{renderSortIcons('is_def')}</span>
              </th>
              <th onClick={() => handleSort('shares')} style={{ cursor: 'pointer' }}>
                Shares
                <span>{renderSortIcons('shares')}</span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.user}</td>
                  <td>{item.acct}</td>
                  <td>{item.qos}</td>
                  <td>{new Date(item.creation_time).toLocaleString()}</td>
                  <td>{new Date(item.mod_time).toLocaleString()}</td>
                  <td>{item.deleted === 1 ? 'Yes' : 'No'}</td>
                  
                  
                  <td>{item.is_def}</td>
                  <td>{item.shares}</td>
                  <td>
                    <div className='d-flex flex-row'>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(item.id_assoc)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => openDetailsModal(item)}
                    >
                      Details
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No results found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal show">
            <div className="modal-content">
              <img src={modalImage} alt="img not found" className="modal-image" />
              <h4>{modalMessage}</h4>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && modalData && (
          <div className="modal show">
            <div className="modal-content">
              <h4>Details for {modalData.user}</h4>
              <p>
                <strong>Id:</strong>  {modalData.id_assoc}
              </p>
              <p>
                <strong>QOS:</strong> {modalData.qos}
              </p>
              <p>
                <strong>User:</strong> {modalData.user}
              </p>
              <p>
                <strong>Deleted:</strong> {modalData.deleted === 1 ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Account:</strong> {modalData.acct}
              </p>
              <p>
                <strong>Default Association:</strong> {modalData.is_def}
              </p>
              <p>
                <strong>Shares:</strong> {modalData.shares}
              </p>
              <p>
                <strong>Creation Time:</strong>{' '}
                {new Date(modalData.creation_time).toLocaleString()}
              </p>
              <p>
                <strong>Last Modified:</strong>{' '}
                {new Date(modalData.mod_time).toLocaleString()}
              </p>
              <button className="update-btn" onClick={() => updateModal(modalData)}>
                Update
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
        {showUpdateModal && updateModalData && (
          <div className="modal show">
            <div className="modal-content">
              <h5>Update for User: {updateModalData.user} </h5>
              <form>
                {/* Non-editable fields (read-only) */}
                <div className="form-group">
                  <strong>ID:</strong>
                  <input type="text" className="form-control readonly-field" value={updateModalData.id_assoc} readOnly />
                </div>
                <div className="form-group">
                  <label><strong>User:</strong></label>
                  <input
                    type="text"
                    className="form-control readonly-field"
                    value={updateModalData.user}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <strong>Deleted:</strong>
                  <input
                    type="text"
                    className="form-control readonly-field"
                    value={updateModalData.deleted === 1 ? 'Yes' : 'No'}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label><strong>Account:</strong></label>
                  <input
                    type="text"
                    className="form-control readonly-field"
                    value={updateModalData.acct}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label><strong>Shares:</strong></label>
                  <input
                    type="number"
                    className="form-control readonly-field"
                    value={updateModalData.shares}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <strong>Existing QOS:</strong>
                  <input
                    type="text"
                    className="form-control readonly-field"
                    value={updateModalData.qos}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label><strong>Modify QOS:</strong></label>
                  <select
                    className="form-control"
                    value={formData.qos}
                    onChange={(e) => setFormData({ ...formData, qos: e.target.value })}
                  >
                    <option value="">-- Select QOS --</option>
                    {qos.map((q) => (
                      <option key={q.name} value={q.name}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Editable field */}
                <div className="form-group">
                  <label><strong>Default Association:</strong></label>
                  <select
                    id="is_def"
                    className="form-control"
                    value={updateModalData.is_def}
                    onChange={(e) =>
                      setUpdateModalData({ ...updateModalData, is_def: e.target.value })
                    }
                  >
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
                <div className='button'>
                  <button
                    type="button"
                    className="button btn btn-danger"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" onClick={handleUpdateSubmit}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Association;





