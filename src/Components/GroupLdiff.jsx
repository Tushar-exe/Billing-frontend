import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import errorImage from '../Assets/image2.png';
import '../App.css';


function GroupLdiff() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios.get("http://10.208.23.139:8520/ldap/ldif-data")
            .then((res) => {
                setUserData(res.data);
                console.log(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err);
                setLoading(false);
            });
    }, []);


        const copyLogs = () => {
        if (!userData || !userData.user_ldif) return;
    
        const entries = Object.entries(userData.group_ldif).map(([key, value]) => {
            // If value is an array (e.g., objectClass), join its elements
            if (Array.isArray(value)) {
                return `${key}: ${value.join(", ")}`;
            }
            return `${key}: ${value}`;
        });
    
        const text = entries.join("\n");
        navigator.clipboard.writeText(text)
            .then(() => toast.success('Data copied to clipboard!'))
            .catch((err) => toast.error('Failed to copy Data'));
    };


    if (loading) return <div className="text-center mt-4 text-primary " style={{top:'40%',left:'45%',position:'absolute'}}><Spinner animation="border" /><h6>Loading Group Data....Please Wait</h6></div>
    // if (error) return <p className="text-danger" style={{top:'40%',left:'45%',position:'absolute'}}>Error loading Group data......</p>



    if(error) return <div className="text-center mt-5" style={{  animation: 'fadeIn 1.5s ease-in-out'}}>
          <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
          <h4 className="text-danger">Oops! Something went wrong...</h4>
          <p className="text-muted">An unexpected error occurred while fetching data.</p>
        </div>


    return (
        <div className="container">
            <div className="d-flex flex-wrap justify-content-center">
            <Card style={{ width: '35rem', height: '25rem', margin: '10px', backgroundColor: 'rgb(253, 253, 253)' }}>
                <Card.Header className="d-flex flex-row justify-content-between bg-dark text-white"><h5>Group.ldif FILE DATA</h5><br/>
                    <Button variant="outline-light" size="sm" onClick={copyLogs}>
                        Copy Data
                    </Button>
                </Card.Header>
                <Card.Body style={{overflowX:'auto',overflowY:'auto',scrollbarWidth:'none'}}>
            <pre>
                <strong>DN                    : {userData.user_ldif?.dn}</strong><br/>
                <strong>Object Class          : {userData.user_ldif?.objectClass.map(type=>{
                return (<h6>                    - {type}</h6>)
                })}</strong><br/>
                <strong>CN                    : {userData.user_ldif?.cn}</strong><br/>
                <strong>GID Number            : {userData.user_ldif?.gidNumber}</strong><br/>
            </pre>
                </Card.Body>
            </Card>
            </div>
            <ToastContainer/>
        </div>
    );
}
export default GroupLdiff;