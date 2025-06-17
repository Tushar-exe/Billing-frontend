
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
              <Card.Title>ADD NEW USER TO LDAP</Card.Title>
              </div>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's contentewd.
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
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
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
                <Card.Title>LDAP RELATED LOGS</Card.Title>
                </div>
                <Card.Text >
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <div className='button'>
              <NavLink to='/logs'>
              <Button  variant="primary">View Logs</Button>
              </NavLink>
              </div>
              </Card.Body>
            </Card>

          </Col>

      </Row>
    </div>
  );
};

export default Ldapoptions;