import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../Custom_css/Custom-card.css'
import user_img from '../Assets/user.jpg';
import assoc_img from '../Assets/assoc.jpg';
import account_img from '../Assets/account.jpg';
import logs_img from '../Assets/logs.jpg';
import qosImage from '../Assets/qosImage.png';
import { NavLink } from 'react-router-dom';

const Slurmoptions = () => {
  return (
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
              <Card.Title>USER DETAILS</Card.Title>
              </div>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <div className='button'>
              <NavLink to='/users_list'>
              <Button  variant="primary">View Users</Button>
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
              <Card.Title>ACCOUNT DETAILS</Card.Title>
              </div>
              <Card.Text >
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
               <div className='button'>
              <NavLink to='/accounts'>
              <Button  variant="primary">View Accounts</Button>
              </NavLink>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='rounded-3 shadow'>
            <Card.Img className='card-img mx-auto d-block mt-3'
            variant="top" src={assoc_img} />
            <Card.Body>
              <div className='text'>
              <Card.Title>ASSOCIATION DETAILS</Card.Title>
              </div>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <div className='button'>
              <NavLink to='/associations'>
              <Button  variant="primary">View Associations</Button>
              </NavLink>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Row className="g-4">
          <Col md={4}>
            <Card className='rounded-3 shadow md-4'>
              <Card.Img className='card-img mx-auto d-block mt-3'
              variant="top" src={qosImage} />
              <Card.Body>
                <div className='text'>
                <Card.Title>QOS DETAILS</Card.Title>
                </div>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <div className='button'>
              <NavLink to='/qos'>
              <Button  variant="primary">View Qos</Button>
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
                <Card.Title>Slurmdbd LOGS</Card.Title>
                </div>
                <Card.Text >
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <div className='button'>
              <NavLink to='/slurm/slurmdbd-log'>
              <Button  variant="primary">View Logs</Button>
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
                <Card.Title>Slurmctld LOGS</Card.Title>
                </div>
                <Card.Text >
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              <div className='button'>
              <NavLink to='/slurm/slurmctld-log'>
              <Button  variant="primary">View Logs</Button>
              </NavLink>
              </div>
              </Card.Body>
            </Card>
                        

          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default Slurmoptions;
