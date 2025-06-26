import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import errorImage from '../Assets/image2.png';

function UserUIDLog() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios
            .get("http://10.208.23.139:8520/ldap/system-users/")
            .then((res) => {
                setUserData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err);
                setLoading(false);
            });
    }, []);
    const highlightLog = (log) => {
        if (log.includes("ERROR")) return <span className="text-danger">{log}</span>;
        if (log.includes("WARNING")) return <span className="text-warning">{log}</span>;
        if (log.includes("INFO")) return <span className="text-info">{log}</span>;
        return <span>{log}</span>;
    };
    const copyLogs = () => {
        const text = userData.entries.join("\n");
        navigator.clipboard.writeText(text);

        toast.success('Data copied to clipboard!')
    };
    if (loading) return <div className="text-center mt-4 text-primary " style={{top:'40%',left:'45%',position:'absolute'}}><Spinner animation="border" /><h6>Loading Uid Data....Please Wait</h6></div>;
    // if (error) return <p className="text-danger" style={{top:'40%',left:'45%',position:'absolute'}}>Error loading logs.</p>


    if(error) return <div className="text-center mt-5" style={{  animation: 'fadeIn 1.5s ease-in-out'}}>
          <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
          <h4 className="text-danger">Oops! Something went wrong...</h4>
          <p className="text-muted">An unexpected error occurred while fetching data.</p>
        </div>

    return (
        <div className="container mt-5" style={{width:'95%'}}>
            <Card>
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <strong>User Uid's</strong>
                    <Button variant="outline-light" size="sm" onClick={copyLogs}>
                        Copy Data
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div
                        style={{
                            maxHeight: "400px",
                            overflowY: "auto",
                            fontFamily: "monospace",
                            backgroundColor: "#F8F9FA",
                            padding: "1rem",
                            borderRadius: "5px",
                        }}
                    >
                        {userData.entries.map((log, index) => (
                            <div key={index}>{highlightLog(log)}</div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
}
export default UserUIDLog;