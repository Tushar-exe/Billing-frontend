// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Button, Card, Spinner } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";
// import errorImage from '../Assets/image2.png';

// function UserLdiff() {
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     useEffect(() => {
//         axios.get("http://10.208.23.139:8520/ldap/ldif-data")
//             .then((res) => {
//                 setUserData(res.data);
//                 console.log(res.data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("Fetch error:", err);
//                 setError(err);
//                 setLoading(false);
//             });
//     }, []);

//     const copyLogs = () => {
//     if (!userData || !userData.user_ldif) return;

//     const entries = Object.entries(userData.user_ldif).map(([key, value]) => {
//         // If value is an array (e.g., objectClass), join its elements
//         if (Array.isArray(value)) {
//             return `${key}: ${value.join(", ")}`;
//         }
//         return `${key}: ${value}`;
//     });

//     const text = entries.join("\n");
//     navigator.clipboard.writeText(text)
//         toast.success('Data copied to clipboard!')
//         // .catch((err) => toast.error('Failed to copy logs'));
// };

//     if (loading) return <div className="text-center mt-4 text-primary " style={{top:'40%',left:'45%',position:'absolute'}}><Spinner animation="border" /><h6>Loading User Data....Please Wait</h6></div>
//     // if (error) return <p className="text-danger" style={{top:'40%',left:'45%',position:'absolute'}}>Error loading User data.....</p>


//     if(error) return <div className="text-center mt-5" style={{  animation: 'fadeIn 1.5s ease-in-out'}}>
//           <img src={errorImage} alt="Error" className="img-fluid" style={{ maxWidth: '200px' }} />
//           <h4 className="text-danger">Oops! Something went wrong...</h4>
//           <p className="text-muted">An unexpected error occurred while fetching data.</p>
//         </div>


//     return (
//         <div className="container">
//           <div className="d-flex flex-wrap justify-content-center">
//             <Card style={{ width: '45rem', height: '45rem', margin: '10px', backgroundColor: 'rgb(253, 253, 253)' }}>
//                 <Card.Header className="d-flex flex-row justify-content-between bg-dark text-white"><h5> User.ldif FILE DATA</h5><br/>
//                 <Button variant="outline-light" size="sm" onClick={copyLogs}>
//                     Copy Data
//                 </Button></Card.Header>
//                 <Card.Body style={{overflowX:'auto',overflowY:'auto'}}>
//             <pre>
//                 <strong>displayName           : {userData.user_ldif?.displayName}</strong><br/>
//                 <strong>mobile                : {userData.user_ldif?.mobile}</strong><br/>
//                 <strong>gender                : {userData.user_ldif?.gender}</strong><br/>
//                 <strong>institute             : {userData.user_ldif?.institute}</strong><br/>
//                 <strong>department            : {userData.user_ldif?.department}</strong><br/>
//                 <strong>designation           : {userData.user_ldif?.designation}</strong><br/>
//                 <strong>application           : {userData.user_ldif?.application}</strong><br/>
//                 <strong>projectname           : {userData.user_ldif?.projectname}</strong><br/>
//                 <strong>PI-HOD                : {userData.user_ldif?.['PI-HOD']}</strong><br />
//                 <strong>domain                : {userData.user_ldif?.domain}</strong><br/>
//                 <strong>subdomain             : {userData.user_ldif?.subdomain}</strong><br/>
//                 <strong>amount                : {userData.user_ldif?.amount}</strong><br/>
//                 <strong>funded                : {userData.user_ldif?.funded}</strong><br/>
//                 <strong>cpuhours              : {userData.user_ldif?.cpuhours}</strong><br/>
//                 <strong>gpuhours              : {userData.user_ldif?.gpuhours}</strong> <br/>
//                 <strong>startdate             : {userData.user_ldif?.startdate}</strong> <br/>
//                 <strong>enddate               : {userData.user_ldif?.enddate}</strong> <br/>
//                 <strong>address               : {userData.user_ldif?.address}</strong><br/>
//                 <strong>description           : {userData.user_ldif?.description}</strong> <br/>
//                 <strong>dn                    : {userData.user_ldif?.dn}</strong><br/>
                
//                 <strong>{userData.user_ldif?.objectClass.map(type=>{
//                     return (<div>objectClass           : {type}</div>)
//                 })}</strong><br/>

//                 <strong>uid                   : {userData.user_ldif?.uid}</strong><br/>
//                 <strong>sn                    : {userData.user_ldif?.sn}</strong><br/>
//                 <strong>givenName             : {userData.user_ldif?.givenName}</strong><br/>
//                 <strong>cn                    : {userData.user_ldif?.cn}</strong><br/>
//                 <strong>mail                  : {userData.user_ldif?.mail}</strong><br/>
//                 <strong>uidNumber             : {userData.user_ldif?.uidNumber}</strong><br/>
//                 <strong>gidNumber             : {userData.user_ldif?.gidNumber}</strong><br/>
//                 <strong>homeDirectory         : {userData.user_ldif?.homeDirectory}</strong><br/>
//                 <strong>loginShell            : {userData.user_ldif?.loginShell}</strong><br/>
//                 <strong>userPassword          : {userData.user_ldif?.userPassword}</strong><br/>
//             </pre>
//                 </Card.Body>
//             </Card>
//             </div>
//             <ToastContainer/>
//         </div>
//     );
// }
// export default UserLdiff;


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
                <Card style={{ width: '60rem', height: '45rem', margin: '10px', backgroundColor: '#fdfdfd' }}>
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