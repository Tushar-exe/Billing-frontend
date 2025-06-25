
import React, { useState, useEffect } from 'react';
import errorImage from '../Assets/image2.png';
import '../App.css';
import Pagination from '../Components/Pagination';
import { useNavigate } from 'react-router-dom';

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
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const base_url = 'http://10.208.23.139:8520';

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
      headers: {
        Accept: 'application/json',
      },
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
    const url = `${base_url}/slurm/user/?task=show_all`
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

  const handleShowUser = () => {
    setShowUser(!showUser);
  };

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
    sortColumn === column ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼';

  const paginatedData = filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);


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
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h1 className="mb-4 mt-5 d-flex justify-content-center">
          {showUser ? 'Active users' : 'All Users'}
        </h1>

        <div className="toggle-button d-flex justify-content-start mb-3">
          <button className="btn btn-info me-2" onClick={handleShowUser}>
            {showUser ? 'Show All Users' : 'Show Active Users'}
          </button>
          <button className="btn btn-info me-2" onClick={() => navigate('/user_form')}>
            Add Existing Ldap User to Slurm
          </button>
        </div>

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

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Sr No</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {renderSortIcons('name')}
              </th>
              <th onClick={() => handleSort('account')} style={{ cursor: 'pointer' }}>
                Account {renderSortIcons('account')}
              </th>
              <th onClick={() => handleSort('qos')} style={{ cursor: 'pointer' }}>
                QOS {renderSortIcons('qos')}
              </th>
              <th onClick={() => handleSort('creation_time')} style={{ cursor: 'pointer' }}>
                Creation Time {renderSortIcons('creation_time')}
              </th>
              <th onClick={() => handleSort('mod_time')} style={{ cursor: 'pointer' }}>
                Last Modified {renderSortIcons('mod_time')}
              </th>
              <th onClick={() => handleSort('deleted')} style={{ cursor: 'pointer' }}>
                Deleted {renderSortIcons('deleted')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <ul className="mb-0">
                    {item.account_qos.map((entry, i) => (
                      <li key={i} className={entry.deleted ? 'text-danger' : ''}>
                        {entry.acct}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul className="mb-0">
                    {item.account_qos.map((entry, i) => (
                      <li key={i} className={entry.deleted ? 'text-danger' : ''}>
                        {entry.qos.join(', ')}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{new Date(item.creation_time).toLocaleString()}</td>
                <td>{new Date(item.mod_time).toLocaleString()}</td>
                <td>{item.deleted ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-sm btn-danger me-1" disabled={item.deleted}>
                    Delete
                  </button>
                  <button className="btn btn-sm btn-primary" disabled={item.deleted}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default User;


