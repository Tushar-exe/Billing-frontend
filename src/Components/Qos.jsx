import React, { useState, useEffect } from 'react';
import '../App.css'; // Your CSS file
import errorImage from '../Assets/image2.png';
import successImage from '../Assets/success.png';
import Pagination from '../Components/Pagination'; // Import the Pagination component
import { useNavigate } from 'react-router-dom';



const Qos = () => {
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
  const [showActiveQos, setShowQos] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [updateModalData, setUpdateModalData] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();
  


  const itemsPerPage = 10; // Number of records per page

  const base_url=`http://192.168.200.131:8520`

  // Fetch data for Active Qos
  const fetchActiveQos = () => {
    const url = `${base_url}/slurm/qos/`;
    fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        setData(jsonData);
        setFilteredData(jsonData.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  // Fetch data for All Associations
  const fetchAllQos = () => {
    const url = `${base_url}/slurm/qos/?task=show_all`;
    fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        setData(jsonData);
        setFilteredData(jsonData.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching all qos');
        setLoading(false);
      });
  };

  // Fetch data based on the view (active or all associations)
  useEffect(() => {
    setLoading(true); // Reset loading state before fetching
    if (showActiveQos) {
      fetchActiveQos();
    } else {
      fetchAllQos();
    }
  }, [showActiveQos]);

  const handleShowQos = () => {
    setShowQos(!showActiveQos);
  };

  const handleComponent=()=>{
    navigate('/qos/add');

  }

  const handleSearch = () => {
    const query = searchQuery.replace(/\s+/g, '').toLowerCase();
    const result = data?.data.filter((item) =>
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
    const url = `${base_url}/slurm/assoc/${id}`;
    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete item');
        }
        return response.json();
      })
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
    console.log('details modal button click');
    setModalData(item);
    setShowDetailsModal(true);
    setShowSuccessModal(false);
  };

  const closeModal = () => {
    console.log('close modal button click');
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

  function parseCustomDate(dateStr) {
    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const TRES_ID_MAP = {
  1: "cpu",
  3: "gpu",
  5: "billing", // Add others if needed
};

const formatGrpTresMins = (grpTresMins) => {
  if (!grpTresMins) return "";
  return grpTresMins.split(',').map(pair => {
    const [id, value] = pair.split('=');
    const name = TRES_ID_MAP[Number(id)] || `TRES${id}`;
    return `${name}=${value}`;
  }).join(', ');
};


return (
    <div>
      <div className="container mt-4">
            <h1 className="mb-4 mt-5 d-flex justify-content-center">
              {showActiveQos ? 'Active Qos Data' : 'All Qos Data'}
            </h1>
            {/* Toggle Button */}
            <div className="toggle-button d-flex justify-content-start mb-3 ">
              <button className="btn btn-info me-2" onClick={handleShowQos}>
                {showActiveQos ? 'Show All Qos' : 'Show Active Qos'}
              </button>
              <button className="btn btn-info me-2" onClick={handleComponent}>
                Add New Qos
              </button>
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
  
            {/* Table Display */}
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name
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
                  <th onClick={() => handleSort('shares')} style={{ cursor: 'pointer' }}>
                    GrpTresMins
                    <span>{renderSortIcons('shares')}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{parseCustomDate(item.creation_time).toLocaleString()}</td>
                      <td>{parseCustomDate(item.mod_time).toLocaleString()}</td>
                      <td>{item.deleted === 1 ? 'Yes' : 'No'}</td>
                      <td>{formatGrpTresMins(item.grp_tres_mins)}</td>
                      <td>
                        <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(item.id_assoc)}>
                          Delete
                        </button>
                        <button className="btn btn-info btn-sm" onClick={() => openDetailsModal(item)}>
                          Details
                        </button>
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
                  <h4>Details for {modalData.name}</h4>
                  <p><strong>Id:</strong> {modalData.id}</p>
                  <p><strong>Name:</strong> {modalData.name}</p>
                  <p><strong>Deleted:</strong> {modalData.deleted === 1 ? 'Yes' : 'No'}</p>
                  <p><strong>Description:</strong> {modalData.description}</p>
                  <p><strong>Creation Time:</strong> {parseCustomDate(modalData.creation_time).toLocaleString()}</p>
                  <p><strong>Last Modified:</strong> {parseCustomDate(modalData.mod_time).toLocaleString()}</p>
                  <button className="update-btn" onClick={() => updateModal(modalData)}>
                    Update
                  </button>
                  <button className="close-btn" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            )}
  
            {/* Update Modal */}
            {showUpdateModal && updateModalData && (
              <div className="modal show">
                <div className="modal-content">
                  <h4>Update for {updateModalData.name}</h4>
                  <form>
                    <div className="form-group">
                      <strong>ID:</strong>
                      <input type="text" className="form-control readonly-field" value={updateModalData.id} readOnly />
                    </div>
                    <div className="form-group">
                      <label><strong>Name:</strong></label>
                      <input
                        type="text"
                        className="form-control readonly-field"
                        value={updateModalData.name}
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
                      <strong>QOS:</strong>
                      <select
                        className="form-control"
                        value={updateModalData.name}
                        onChange={(e) =>
                          setUpdateModalData((prevData) => ({
                            ...prevData,
                            qos: e.target.value,
                          }))
                        }
                      >
                        <option value="acer_nsm">acer_nsm</option>
                        <option value="acer_ext">acer_ext</option>
                        <option value="normal">normal</option>
                      </select>
                    </div>
                    <div className="button">
                      <button
                        type="button"
                        className="button btn btn-danger"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
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

export default Qos;