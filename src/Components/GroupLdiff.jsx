import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
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
if (loading) return <div className="text-center mt-4 text-primary " style={{top:'40%',left:'45%',position:'absolute'}}><Spinner animation="border" /><h6>Loading Group Data....Please Wait</h6></div>
  if (error) return <p className="text-danger" style={{top:'40%',left:'45%',position:'absolute'}}>Error loading data......</p>

    return (
        <div className="container">
            <div className="d-flex flex-wrap justify-content-center">
            <Card style={{ width: '35rem', height: '25rem', margin: '10px', backgroundColor: 'rgb(253, 253, 253)' }}>
                <Card.Header className="d-flex flex-wrap justify-content-center bg-dark text-white"><h5 className="justify-c">Group.ldif FILE DATA</h5><br/></Card.Header>
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
        </div>
    );
}
export default GroupLdiff;