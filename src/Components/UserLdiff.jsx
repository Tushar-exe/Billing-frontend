import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import errorImage from '../Assets/image2.png';

function UserLdiff() {
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

    const entries = Object.entries(userData.user_ldif).map(([key, value]) => {
        // If value is an array (e.g., objectClass), join its elements
        if (Array.isArray(value)) {
            return `${key}: ${value.join(", ")}`;
        }
        return `${key}: ${value}`;
    });

    const text = entries.join("\n");
    navigator.clipboard.writeText(text)
        toast.success('Data copied to clipboard!')
        // .catch((err) => toast.error('Failed to copy logs'));
};

    if (loading) return <div className="text-center mt-4 text-primary " style={{top:'40%',left:'45%',position:'absolute'}}><Spinner animation="border" /><h6>Loading User Data....Please Wait</h6></div>
    // if (error) return <p className="text-danger" style={{top:'40%',left:'45%',position:'absolute'}}>Error loading User data.....</p>


    if(error) return <div className="text-center mt-5" style={{  animation: 'fadeIn 1.5s ease-in-out'}}>
          <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
          <h4 className="text-danger">Oops! Something went wrong...</h4>
          <p className="text-muted">An unexpected error occurred while fetching data.</p>
        </div>


    return (
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center">
            <Card style={{ width: '45rem', height: '45rem', margin: '10px', backgroundColor: 'rgb(253, 253, 253)' }}>
                <Card.Header className="d-flex flex-row justify-content-between bg-dark text-white"><h5> User.ldif FILE DATA</h5><br/>
                <Button variant="outline-light" size="sm" onClick={copyLogs}>
                    Copy Data
                </Button></Card.Header>
                <Card.Body style={{overflowX:'auto',overflowY:'auto'}}>
            <pre>
                <strong>Display Name          : {userData.user_ldif?.displayName[0]}</strong><br/>
                <strong>Mobile                : {userData.user_ldif?.mobile}</strong><br/>
                <strong>Institute             : {userData.user_ldif?.institute}</strong><br/>
                <strong>Department            : {userData.user_ldif?.department}</strong><br/>
                <strong>Designation           : {userData.user_ldif?.designation}</strong><br/>
                <strong>Application           : {userData.user_ldif?.application}</strong><br/>
                <strong>Project Name          : {userData.user_ldif?.projectname}</strong><br/>
                <strong>PI-HOD                : {userData.user_ldif?.['PI-HOD']}</strong><br />
                <strong>Domain                : {userData.user_ldif?.domain}</strong><br/>
                <strong>Subdomain             : {userData.user_ldif?.subdomain}</strong><br/>
                <strong>Amount                : {userData.user_ldif?.amount}</strong><br/>
                <strong>Funded                : {userData.user_ldif?.funded}</strong><br/>
                <strong>cpuhours              : {userData.user_ldif?.cpuhours}</strong><br/>
                <strong>gpuhours              : {userData.user_ldif?.gpuhours}</strong> <br/>
                <strong>Start Date            : {userData.user_ldif?.startdate}</strong> <br/>
                <strong>End Date              : {userData.user_ldif?.enddate}</strong> <br/>
                <strong>Address               : {userData.user_ldif?.address}</strong><br/>
                <strong>Description           : {userData.user_ldif?.description}</strong> <br/>
                <strong>DN                    : {userData.user_ldif?.dn}</strong><br/>
                <strong>Object Class          : {userData.user_ldif?.objectClass.map(type=>{
                    return (<h6>                    - {type}</h6>)
                })}</strong><br/>
                <strong>UID                   : {userData.user_ldif?.uid}</strong><br/>
                <strong>SN                    : {userData.user_ldif?.sn}</strong><br/>
                <strong>Given Name            : {userData.user_ldif?.givenName}</strong><br/>
                <strong>CN                    : {userData.user_ldif?.cn}</strong><br/>
                <strong>Mail                  : {userData.user_ldif?.mail}</strong><br/>
                <strong>UID Number            : {userData.user_ldif?.uidNumber}</strong><br/>
                <strong>GID Number            : {userData.user_ldif?.gidNumber}</strong><br/>
                <strong>Home Directory        : {userData.user_ldif?.homeDirectory}</strong><br/>
                <strong>Login Shell           : {userData.user_ldif?.loginShell}</strong><br/>
                <strong>User Password          : {userData.user_ldif?.userPassword}</strong><br/>
            </pre>
                </Card.Body>
            </Card>
            </div>
            <ToastContainer/>
        </div>
    );
}
export default UserLdiff;