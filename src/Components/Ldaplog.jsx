
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import errorImage from '../Assets/image2.png';
import { useNavigate } from "react-router-dom";


function LdapLog() {
  const [logs, setLogs] = useState([]);
  const [limit] = useState(100); // Number of lines per fetch
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const offsetRef = useRef(0);
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BACKEND_URL;
  const fetchLogs = async () => {
    
    if (loading) return;
    setLoading(true);
    
    try {
      const res = await axios.get(
        `${base_url}/ldap/logs/?offset=${offsetRef.current}&limit=${limit}`
      );
      const newLogs = res.data.entries || [];
      console.log(offsetRef.current)
      setLogs((prev) => [...prev, ...newLogs.filter(log => !prev.includes(log))]);
      offsetRef.current += newLogs.length;
      if(newLogs.length!==0 && offsetRef.current > 200){
        toast.success("100 More Logs Loaded")
      }
      if (res.data.total !== undefined) {
        setHasMore(offsetRef.current < res.data.total);
      } else {
        setHasMore(newLogs.length === limit);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(err);
    } finally {
      
      setLoading(false);
    }
  };

  const copyLogs = () => {
    const text = logs.map((log, index) => `${index + 1}. ${log}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Logs copied to clipboard!");
  };

  const highlightLog = (log, index) => {
    let style = "text-dark";
    if (log.includes("ERROR")) style = "text-danger fw-bold";
    else if (log.includes("WARNING")) style = "text-warning fw-bold";
    else if (log.includes("INFO")) style = "text-info";

    return (
      <div key={index}>
        <span className="text-secondary me-2">{index + 1}.</span>
        <span className={style}>{log}</span>
      </div>
    );
  };

  useEffect(() => {
    fetchLogs(); // Fetch initial logs on mount
  }, []);

  // if (error)
  //   return <p className="text-danger text-center mt-4">Error loading logs.</p>;

      if(error) return <div className="text-center mt-5" style={{  animation: 'fadeIn 1.5s ease-in-out'}}>
          <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
          <h4 className="text-danger">Oops! Something went wrong...</h4>
          <p className="text-muted">An unexpected error occurred while fetching data.</p>
        </div>

  return (
    <div className="container mt-5" style={{width:'95%'}}>
 
      <Card>
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <strong>LDAP Logs</strong>
          <div className="d-flex gap-2">
            <Button variant="outline-light bg-white text-dark " size="sm" onClick={copyLogs}>
              Copy Logs
            </Button>
            {hasMore && (
              <Button variant="outline-danger text-white bg-danger" size="sm" onClick={fetchLogs} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-1" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              fontFamily: "monospace",
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "5px",
            }}
          >
            {logs.length > 0 ? (
              logs.map((log, index) => highlightLog(log, index))
            ) : (
              <div className="text-muted">No logs found.</div>
            )}
          </div>
        </Card.Body>
      </Card>
      <div className='pb-2 pt-2'>
        <button className='btn btn-primary' style={{position:'absolute',left:'50%'}} onClick={()=>{navigate('/ldap/options')}}>
        BACK
      </button>
      <br/>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LdapLog;

