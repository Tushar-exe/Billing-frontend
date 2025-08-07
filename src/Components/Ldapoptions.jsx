
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../Custom_css/Custom-card.css'
import user_img from '../Assets/user.jpg';

import account_img from '../Assets/account.jpg';
import logs_img from '../Assets/logs.jpg';
import { NavLink } from 'react-router-dom';

const Ldapoptions=()=>{
    return(
      <>
      <br />
 <div className="container mt-5 animated-container">
      <Row className="g-4">
        <Col md={4}>
          <Card className='rounded-3 shadow md-4'>
            <Card.Img className='card-img mx-auto d-block mt-3'
              variant="top"
              src={user_img}
            />

            <Card.Body>
              <div className='text'>
              <Card.Title>ADD USER TO LDAP</Card.Title>
              </div>
              <Card.Text>
                Register a new user in the LDAP directory.
                Fill out the required details to grant access.
              </Card.Text>
              <div className='button'>
              <NavLink to='/ldap'>
              <Button  variant="primary">Add Users</Button>
              </NavLink>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='rounded-3 shadow'>
            <Card.Img className='card-img mx-auto d-block mt-3'
            variant="top" src={account_img} />
            <Card.Body>
              <div className='text'>
              <Card.Title>LDAP USERS DETAILS</Card.Title>
              </div>
              <Card.Text >
                Browse and manage existing LDAP users. Update user information or review account status.
              </Card.Text>
               <div className='button'>
              <NavLink to='/ldap_update'>
              <Button  variant="primary">View Ldap Users</Button>
              </NavLink>
              </div>
            </Card.Body>
          </Card>
        </Col>
          <Col md={4}>
            <Card className='rounded-3 shadow'>
              <Card.Img className='card-img mx-auto d-block mt-3' 
              variant="top" src={logs_img}/>
              <Card.Body>
                <div className='text'>
                <Card.Title>SLAPD RELATED LOGS</Card.Title>
                </div>
                <Card.Text >
                  Access and review SLAPD server logs for monitoring and troubleshooting LDAP operations.
                </Card.Text>
              <div className='button'>
              <NavLink to='/ldap/logs'>
              <Button  variant="primary">View Logs</Button>
              </NavLink>
              </div>
              </Card.Body>
            </Card>
            <br />
            <br />

          </Col>

      </Row>
    </div>
    </>
  );
};

export default Ldapoptions;
/*
Card.Text replacements:

1. ADD NEW USER TO LDAP:
  "Register a new user in the LDAP directory. Fill out the required details to grant access."

2. LDAP USERS DETAILS:
  "Browse and manage existing LDAP users. Update user information or review account status."

3. SLAPD RELATED LOGS:
  "Access and review SLAPD server logs for monitoring and troubleshooting LDAP operations."
*/