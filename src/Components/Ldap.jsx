import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../Custom_css/Ldap.css';
import '../Custom_css/Loading-overlay.css';
import { useNavigate } from 'react-router-dom';

const Ldap = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const base_url = `http://192.168.200.131:8520`;

  const initialValues = {
    displayName: '', userName: '', userEmail: '', organization: '', gender: '',
    mob_no: '', institute: '', dept: '', desg: '', domain: '', sub_domain: '', app: '',
    proj_name: '', pi: '', amt: '', fund: '', cpu: '', gpu: '',
    startDate: '', endDate: '', address: '', description: ''
  };

  // const currDate = new Date();
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required').trim("Name is requiured"),
    userName: Yup.string().required('User name is required').trim("User Name is requiured"),
    userEmail: Yup.string().email('Invalid email').required('Email is required').trim("Email is requiured"),
    organization: Yup.string().required('Organization name is required').trim("Organization name is requiured"),
    gender: Yup.string().required('Gender is required').trim("Gender is requiured"),
    mob_no: Yup.string().typeError('Mobile number must be a number').required('Mobile number is required').matches(phoneRegExp, 'Phone number is not valid'),
    institute: Yup.string().required('Institute name is required').trim("Institute name is requiured"),
    dept: Yup.string().required('Dept is requiured').trim("Dept is requiured"),
    desg: Yup.string().required('Designation is reuired').trim("Designation is requiured"),
    domain: Yup.string().required('Domain is required').trim("Domain is required"),
    sub_domain: Yup.string().required('Sub Domain is required').trim("Sub Domain is required"),
    app: Yup.string().required('Application is required').trim("Application is required"),
    proj_name: Yup.string().required('Project name is required').trim("Project name is required"),
    pi: Yup.string().required('PI is required').trim("PI is required"),
    amt: Yup.number().typeError('Must be a number').required('Amount is required').positive().integer().min(0,'cpu value must be more than 0'),
    fund: Yup.string().required('Required').trim("Fund is required"),
    cpu: Yup.number().typeError('Must be a number').required('cpu hours is required').integer().min(0,'cpu value must be more than 0'),
    gpu: Yup.number().typeError('Must be a number').required('gpu hours is required').integer().min(0,'gpu value must be more than 0'),
    // startDate: Yup.date().required('Start Date is required').min(currDate, 'Start date cannot be earlier than Current date'),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date().required('End Date is required').min(Yup.ref('startDate'), 'End date cannot be earlier than start date'),
    address: Yup.string().required('Address is required').trim("Address  is required"),
    description: Yup.string().required('Description is required').trim("Description  is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      mob_no: parseInt(values.mob_no),
      amt: parseInt(values.amt),
      cpu: parseInt(values.cpu),
      gpu: parseInt(values.gpu),
    };

    console.log('Form Submitted:', formData);

    try {
      const response = await fetch(`${base_url}/ldap/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.message === 'User already exists in LDAP') {
        alert('User already exists in LDAP');
      } else if (result.message === 'User added successfully to LDAP') {
        alert('User created successfully in LDAP');
      } else {
        alert('Error occurred in adding user In LDAP');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const [previewValues, setPreviewValues] = useState({});
  const handlePreview = (values) => {
    setPreviewValues(values);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <div className="text-white mt-2">Processing... Please wait</div>
        </div>
      )}

      <div className="container mt-5 mb-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <div className="row shadow p-4" style={{ background: '#fff', borderRadius: '8px' }}>
                <h2 className="text-center mb-4">ADD USER TO LDAP</h2>

                <div className="col-12 col-md-6 border-end fade-in-left mb-4 mb-md-0">
                  <div className="mb-3">
                    <label>Display Name:</label>
                    <Field type="text" name="displayName" className="form-control" />
                    <ErrorMessage name="displayName" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>User Name:</label>
                    <Field type="text" name="userName" className="form-control" />
                    <ErrorMessage name="userName" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Email Id:</label>
                    <Field type="email" name="userEmail" className="form-control" />
                    <ErrorMessage name="userEmail" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Organization:</label>
                    <Field type="text" name="organization" className="form-control" />
                    <ErrorMessage name="organization" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Gender:</label><br />
                    <label><Field type="radio" name="gender" value="male" /> Male</label>
                    <label className="ms-2"><Field type="radio" name="gender" value="female" /> Female</label>
                    <label className="ms-2"><Field type="radio" name="gender" value="other" /> Other</label>
                    <ErrorMessage name="gender" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Mobile No:</label>
                    <Field type="number" name="mob_no" className="form-control" />
                    <ErrorMessage name="mob_no" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Institute:</label>
                    <Field type="text" name="institute" className="form-control" />
                    <ErrorMessage name="institute" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Department:</label>
                    <Field type="text" name="dept" className="form-control" />
                    <ErrorMessage name="dept" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Designation:</label>
                    <Field type="text" name="desg" className="form-control" />
                    <ErrorMessage name="desg" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Domain:</label>
                    <Field type="text" name="domain" className="form-control" />
                    <ErrorMessage name="domain" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Sub Domain:</label>
                    <Field type="text" name="sub_domain" className="form-control" />
                    <ErrorMessage name="sub_domain" component="div" className="text-danger" />
                  </div>
                </div>

                <div className="col-12 col-md-6 fade-in-right">
                     <div className="mb-3">
                    <label>Application:</label>
                    <Field type="text" name="app" className="form-control" />
                    <ErrorMessage name="app" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Project Name:</label>
                    <Field type="text" name="proj_name" className="form-control" />
                    <ErrorMessage name="proj_name" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>PI:</label>
                    <Field type="text" name="pi" className="form-control" />
                    <ErrorMessage name="pi" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Amount:</label>
                    <Field type="number" name="amt" className="form-control" />
                    <ErrorMessage name="amt" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Funded:</label>
                    <Field as="select" name="fund" className="form-control">
                      <option value="">Select</option>
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </Field>
                    <ErrorMessage name="fund" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>CPU Hours:</label>
                    <Field type="number" name="cpu" className="form-control" />
                    <ErrorMessage name="cpu" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>GPU Hours:</label>
                    <Field type="number" name="gpu" className="form-control" />
                    <ErrorMessage name="gpu" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Start Date:</label>
                    <Field type="date" name="startDate" className="form-control" />
                    <ErrorMessage name="startDate" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>End Date:</label>
                    <Field type="date" name="endDate" className="form-control" />
                    <ErrorMessage name="endDate" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Address:</label>
                    <Field type="text" name="address" className="form-control" />
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label>Description:</label>
                    <Field type="text" name="description" className="form-control" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn btn-danger">Submit</button>
                    <button type="button" className="btn btn-primary ms-2" onClick={() => handlePreview(values)}>Preview Form</button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {showModal && (
        <div className="modal show fade d-block d-flex align-items-center" tabIndex="-1" role="dialog">
          <div className="modal-dialog custom-modal" role="document">
            <div className="modal-content custom-content">
              <div className="modal-header d-block text-center">
                <h5 className="modal-title w-100">Form Preview</h5>
                <button type="button" className="btn-close position-absolute top-0 end-0 mt-4 me-2" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {Object.entries(previewValues).map(([key, value]) => (
                  <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</p>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
        
      )}
      {/* <button className='btn btn-primary' onClick={()=>{navigate('/ldap/options')}}>
        BACK
      </button> */}
    </>
  );
};

export default Ldap;
