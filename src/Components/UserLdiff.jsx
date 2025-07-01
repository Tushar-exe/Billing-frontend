
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import errorImage from '../Assets/image2.png';

function UserLdiff() {
    const [ldifText, setLdifText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://10.208.23.139:8520/ldap/ldif-data")
            .then((res) => {
                setLdifText(res.data.user_ldif);  // raw string from backend
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err);
                setLoading(false);
            });
    }, []);

    const copyLogs = () => {
        if (!ldifText) return;
        navigator.clipboard.writeText(ldifText)
            .then(() => toast.success('User.ldif data copied to clipboard!'))
            .catch(() => toast.error('Failed to copy LDIF data.'));
    };

    if (loading) return (
        <div className="text-center mt-4 text-primary" style={{ top: '40%', left: '45%', position: 'absolute' }}>
            <Spinner animation="border" />
            <h6>Loading User.ldif data....Please Wait</h6>
        </div>
    );

    if (error) return (
        <div className="text-center mt-5" style={{ animation: 'fadeIn 1.5s ease-in-out' }}>
            <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
            <h4 className="text-danger">Oops! Something went wrong...</h4>
            <p className="text-muted">An unexpected error occurred while fetching data.</p>
        </div>
    );

    return (
        <div className="container">
            <div className="d-flex flex-wrap justify-content-center">
                {/* <Card style={{ width: '60rem', height: '45rem', margin: '10px', backgroundColor: '#fdfdfd' }}> */}
                <Card style={{ width: '60rem',backgroundColor: '#fdfdfd' }}>
                    <Card.Header className="d-flex justify-content-between bg-dark text-white">
                        <h5>User.ldif FILE DATA</h5>
                        <Button variant="outline-light" size="sm" onClick={copyLogs}>
                            Copy Data
                        </Button>
                    </Card.Header>
                    <Card.Body style={{ overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        <pre style={{ fontWeight: 'bold',fontSize: '1.1rem' }}>{ldifText}</pre>
                    </Card.Body>
                </Card>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UserLdiff;