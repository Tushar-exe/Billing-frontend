

import React from "react";

import hpc1 from '../Assets/hpc1.jpg';
import user from '../Assets/user.jpg';
import test from '../Assets/test.jpg';
import test2 from '../Assets/test2.jpg';
import test3 from '../Assets/test3.jpg';
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import '../Custom_css/Custom-card.css';

const HomeComponent = () => {

  const navigate = useNavigate();

  return (
    <>
      {/* <div><img
        src={homeImage}
        alt="img not"
        style={{ height: "720px", width: "100%", marginLeft: "40px",marginTop:"20px", }}
      />

      </div> */}
      {/* <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src={user_img} class="d-block w-100" alt="..." />
    </div>
    <div class="carousel-item">
      <img src={user_img} class="d-block w-100" alt="..." />
    </div>
    <div class="carousel-item">
      <img src={user_img} class="d-block w-100" alt="..." />
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div> */}

      <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', }}>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active " data-bs-interval="10000">
            <img src={hpc1} className="d-block w-100 " style={{ height: '350px' }} alt="" />
            <div className="carousel-caption d-none d-md-block">
              <h5>First slide label</h5>
              <p>Some representative placeholder content for the first slide.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img src={hpc1} className="d-block w-100" style={{ height: '350px' }} alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Second slide label</h5>
              <p>Some representative placeholder content for the second slide.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={hpc1} className="d-block w-100" style={{ height: '350px' }} alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Third slide label</h5>
              <p>Some representative placeholder content for the third slide.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <br></br>

      <div className="d-flex flex-row justify-content-between" style={{ marginLeft: '80px' }}>
        <div className="card m-2 text-black " style={{ width: '350px', borderRadius: '30px', cursor: 'pointer' }} onClick={() => { navigate('/ldap/options') }}>
          <img className="card-img mx-auto d-block mt-3" src={test} alt="" style={{ borderRadius: '75px' }} />
          <div className="card-body">
            <h5 className="card-title text-center">LDAP </h5>
            <p className="card-text">Manage user authentication and directory services for your organization.
</p>
            <div className='button'>
              <NavLink to='/ldap/options'>
                <Button variant="primary">Access LDAP</Button>
              </NavLink>
            </div>
          </div>

        </div>
        <div className="card m-2 text-black" style={{ width: '350px', borderRadius: '30px', cursor: 'pointer' }} onClick={() => { navigate('/slurm/options') }}>
          <img className="card-img mx-auto d-block mt-3" src={test3} alt="" />
          <div className="card-body">
            <h5 className="card-title text-center">SLURM </h5>
            <p className="card-text">Monitor and control high-performance computing jobs and resources.</p>
            <div className='button'>
              <NavLink to='/slurm/options'>
                <Button variant="primary">Access SLURM</Button>
              </NavLink>
            </div>
          </div>

        </div>
        <div className="card m-2 text-black" style={{ width: '350px', borderRadius: '30px', cursor: 'pointer' }} onClick={() => { navigate('/billing') }}>
          <img className="card-img mx-auto d-block mt-3" src={test2} alt="" />
          <div className="card-body">
            <h5 className="card-title text-center">BILLING</h5>
            <p className="card-text">View and manage billing information, usage, and invoices.</p>
            <div className='button'>
              <NavLink to='/billing'>
                <Button variant="primary">Access BILLING</Button>
              </NavLink>
            </div>
          </div>

        </div>

      </div>

    </>
  );
};

export default HomeComponent;
