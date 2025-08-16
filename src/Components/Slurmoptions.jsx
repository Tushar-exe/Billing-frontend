import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../Custom_css/Custom-card.css'
import user_img from '../Assets/user.png';
import assoc_img from '../Assets/assoc.png';
import account_img from '../Assets/account.png';
import logs_img from '../Assets/logs.png';
import qosImage from '../Assets/qosImage.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Slurmoptions = () => {



  return (
    <>
      <br />
      <div className="container mt-5 animated-container">
        <Row className="g-4">
          <Col md={4}>
            <Card className='rounded-3 shadow md-4' role='button'>
              <Card.Img className='card-img mx-auto d-block mt-3'
                variant="top"
                src={user_img}
              />
              <Card.Body>
                <div className='text'>
                  <Card.Title className='display-6' style={{ 'fontSize': '1.4rem', "fontWeight": '500' }}>USER DETAILS</Card.Title>
                </div>
                <Card.Text className='text-center text-small text-muted my-2'>
                  View and manage all users registered in the Slurm system, including their roles, usage, and status.
                </Card.Text>
                <div className='button'>
                  <NavLink to='/slurm/users_list'>
                    <button className='btn btn-sm btn-primary my-2'>View</button>
                  </NavLink>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='rounded-3 shadow' role='button'>
              <Card.Img className='card-img mx-auto d-block mt-3'
                variant="top" src={account_img} />
              <Card.Body>
                <div className='text'>
                  <Card.Title className='display-6' style={{ 'fontSize': '1.4rem', "fontWeight": '500' }}>ACCOUNT DETAILS</Card.Title>
                </div>
                <Card.Text className='text-center text-small text-muted my-2' >
                  Access detailed information about Slurm accounts, including balances, limits, and associated users.
                </Card.Text>
                <div className='button'>
                  <NavLink to='/slurm/accounts'>
                    <button className='btn btn-sm btn-primary my-2'>View</button>
                  </NavLink>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='rounded-3 shadow' role='button'>
              <Card.Img className='card-img mx-auto d-block mt-3'
                variant="top" src={assoc_img} />
              <Card.Body>
                <div className='text'>
                  <Card.Title className='display-6' style={{ 'fontSize': '1.4rem', "fontWeight": '500' }}>ASSOCIATION DETAILS</Card.Title>
                </div>
                <Card.Text className='text-center text-small text-muted my-2'>
                  Explore user-account associations, permissions, and resource allocations within the cluster.
                </Card.Text>
                <div className='button'>
                  <NavLink to='/slurm/associations'>
                    <button className='btn btn-sm btn-primary my-2'>View</button>
                  </NavLink>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Row className="g-4">
            <Col md={4}>
              <Card className='rounded-3 shadow md-4' role='button'>
                <Card.Img className='card-img mx-auto d-block mt-3'
                  variant="top" src={qosImage} />
                <Card.Body>
                  <div className='text'>
                    <Card.Title className='display-6' style={{ 'fontSize': '1.4rem', "fontWeight": '500' }}>QOS DETAILS</Card.Title>
                  </div>
                  <Card.Text className='text-center text-small text-muted my-2'>
                    Review Quality of Service (QOS) configurations, priorities, and limits for workload management.
                  </Card.Text>
                  <div className='button'>
                    <NavLink to='/slurm/qos'>
                      <button className='btn btn-sm btn-primary my-2'>View</button>
                    </NavLink>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className='rounded-3 shadow' role='button'>
                <Card.Img className='card-img mx-auto d-block mt-3'
                  variant="top" src={logs_img} />
                <Card.Body>
                  <div className='text'>
                    <Card.Title className='display-6' style={{ 'fontSize': '1.4rem', "fontWeight": '500' }}>Slurmdbd LOGS</Card.Title>
                  </div>
                  <Card.Text className='text-center text-small text-muted my-2' >
                    Monitor and analyze Slurm database daemon logs for auditing and troubleshooting purposes.
                  </Card.Text>
                  <div className='button'>
                    <NavLink to='/slurm/slurmdbd-log'>
                      <button className='btn btn-sm btn-primary my-2'>View</button>
                    </NavLink>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className='rounded-3 shadow' role='button'>
                <Card.Img className='card-img mx-auto d-block mt-3'
                  variant="top" src={logs_img} />
                <Card.Body>
                  <div className='text'>
                    <Card.Title className='display-6' style={{ 'fontSize': '1.4rem', "fontWeight": '500' }}>Slurmctld LOGS</Card.Title>
                  </div>
                  <Card.Text className='text-center text-small text-muted my-2' >
                    Inspect Slurm controller logs to track job scheduling, errors, and system events.
                  </Card.Text>
                  <div className='button'>
                    <NavLink to='/slurm/slurmctld-log'>
                      <button className='btn btn-sm btn-primary my-2'>View</button>
                    </NavLink>
                  </div>
                </Card.Body>
              </Card>


            </Col>
          </Row>
        </Row>
      </div>
      <br />
      <br />
    </>
  );
};

export default Slurmoptions;
