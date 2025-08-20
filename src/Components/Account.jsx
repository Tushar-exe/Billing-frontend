import React, {useState,useEffect} from "react";

import '../App.css'; // Your CSS file
import errorImage from '../Assets/image2.png';
import successImage from '../Assets/success.png';
import Pagination from '../Components/Pagination';
import '../Custom_css/Modal.css';
import { useNavigate } from "react-router-dom";

const Account= ()=>{
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalMessage, setModalMessage] = useState('');
  const [modalImage, setModalImage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showActiveAccount, setShowAccount] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 10; // Number of records per page
  // const base_url=`http://10.208.34.9:9000`   //Shrestha Ip Address
  // const base_url = 'http://10.208.22.180:8520';
  
  // const base_url = 'http://paramrudra.pune.cdac.in:8520';
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const navigate =useNavigate();

  const fetchActiveAccount = () => {
    console.log(base_url)
    const url = `${base_url}/slurm/account/`;
    fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        //console.log(jsonData);
        if (jsonData && Array.isArray(jsonData.data)) {
            setData(jsonData.data);
            setFilteredData(jsonData.data);
          } else {
            console.error("Unexpected data format. Please check API response:", jsonData);
            setError("Invalid data format from API");
          }
          setLoading(false);
        })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  const fetchAllAccount = () => {
    const url = `${base_url}/slurm/account/?task=show_all`;
    fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        console.log(jsonData);
        setData(jsonData);
        setFilteredData(jsonData);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true); // Reset loading state before fetching
    if (showActiveAccount) {
      fetchActiveAccount();
    } else {
      fetchAllAccount();
    }
  }, [showActiveAccount]);

  const handleShowAccount = () => {
    setShowAccount(!showActiveAccount);
  };

  const handleCreateAccount= ()=>{
    console.log("button clicked")
    setShowAddAccountModal(true);
    
  }

  const handleModifyAccount= ()=>{
    console.log("button clicked");
    navigate("/slurm/accounts/add");
    
  }


  const handleCloseModal = () => {
    setShowAddAccountModal(false);
    setAccountName('');
    setSelectedOption('');
    setSuccessMessage('');

  };
  

  const handleSubmit = async () => {
    console.log('Account Name:', accountName);
    console.log('Selected Option:', selectedOption);  
  
    try {
      const payload = {
        name: accountName,
        type: selectedOption,
      };
  
      const response = await fetch(`${base_url}/slurm/account/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log("Sending data to backend:", payload);
        setSuccessMessage('Account created successfully!');
        setErrorMessage('');
  
        //  Close modal after 2 seconds
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      } else {
        setErrorMessage('Failed to create account. Please check your input.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      console.error(error);
    }
  };
  

  const handleSearch = () => {
    const query = searchQuery.replace(/\s+/g, '').toLowerCase();
    const result = data?.filter((item) =>
      Object.values(item).some((value) =>
        value != null && value.toString().replace(/\s+/g, '').toLowerCase().includes(query)
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
        const updatedData = filteredData.filter(item => item.id !== id);
        setFilteredData(updatedData);
      })
      .catch((error) => {
        setModalMessage(`Error: Failed to delete data`);
        setModalImage(errorImage);
        setShowSuccessModal(true);
      });
  };


  const renderSortIcons = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '▲▼';
  };

  // Calculate the data to display for the current page
  const paginatedData = Array.isArray(filteredData)
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

  return (
    <div>
      <div className="container mt-4">
        <h1 className="mb-4 mt-5 d-flex justify-content-center">
          {showActiveAccount ? 'Active Account' : 'All Active Accounts'}
        </h1>

      <div className='d-flex flex-row justify-content-between'>

        <div className='d-flex flex-row justify-content-start'>
          <div className="d-flex flex-row mb-3">
            <button className="btn btn-primary" onClick={() => {
              navigate(-1);
              }}>Back</button>
          </div>

          {/* Toggle Button */}
          <div className="toggle-button d-flex mb-3 ms-2 ">
            <button
              className="btn btn-info me-2"
              onClick={handleShowAccount} // Toggle between Active Associations and All Associations
            >
             {showActiveAccount ? 'Show All Account' : 'Show Active Account'}
            </button>
            <button className="btn btn-info me-2" onClick={handleCreateAccount}>Add New Account</button>
           <button className="btn btn-info me-2" onClick={handleModifyAccount}>Add Qos To Account</button>
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

        {showAddAccountModal && (
          <div className="modal show">
            <div className="modal-content">
              <h4>Create Account</h4>
              <form
                  onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  handleSubmit();
                  }}
              >
              <div className="mb-3">
                <label>New Account Name:</label>
                <input 
                  type="text"
                  required
                  value={accountName}
                  pattern="[A-Za-z\s]+"
                  onChange={(e) => setAccountName(e.target.value)}
                  className="form-control"
                  title="Only letters and spaces are allowed"ss
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="me-2">Type:</label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="form-select me-2"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="nsm_ext">nsm_ext</option>
                  <option value="nsm_paid">nsm_paid</option>
                  <option value="default">default</option>
                </select>
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {successMessage && <p className="text-success">{successMessage}</p>}
              <button className="update-btn me-2"s>Submit</button>
              <button className="close-btn" onClick={handleCloseModal}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        

        {/* Table Display */}
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Sr No</th>
              <th onClick={() => handleSort('qos')} style={{ cursor: 'pointer' }}>
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
            </tr>
          </thead>
          <tbody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{new Date(item.creation_time).toLocaleString()}</td>
                  <td>{new Date(item.mod_time).toLocaleString()}</td>
                  <td>{item.deleted === 1 ? 'Yes' : 'No'}</td>
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
       
      </div>
    </div>
  );
};

export default Account;