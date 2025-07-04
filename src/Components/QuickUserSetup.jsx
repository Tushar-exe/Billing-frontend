
import React, { useState } from 'react';
import Ldap from './Ldap';
import UserForm from './UserForm';
import { useEffect } from 'react';
import AccountWithQos from './AccountWithQos';
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const QuickUserSetup = () => {

    // Ldap states
      const [showModal, setShowModal] = useState(false);
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const base_url = `http://10.208.23.139:8520`;
    
      const initialValues = {
        displayName: '', userName: '', userEmail: '', organization: '', gender: '',
        mob_no: '', institute: '', dept: '', desg: '', domain: '', sub_domain: '', app: '',
        proj_name: '', pi: '', amt: '', fund: '', cpu: '', gpu: '',
        startDate: '', endDate: '', address: '', description: ''
      };
      const fileInputRef = React.useRef(null);
    
      const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    
      const validationSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        userName: Yup.string().required('User name is required'),
        userEmail: Yup.string().email('Invalid email').required('Email is required'),
        organization: Yup.string().required('Organization name is required'),
        gender: Yup.string().required('Gender is required'),
        mob_no: Yup.string().typeError('Mobile number must be a number').required('Mobile number is required').matches(phoneRegExp, 'Phone number is not valid'),
        institute: Yup.string().required('Institute name is required'),
        dept: Yup.string().required('Dept is required'),
        desg: Yup.string().required('Designation is required'),
        domain: Yup.string().required('Domain is required'),
        sub_domain: Yup.string().required('Sub Domain is required'),
        app: Yup.string().required('Application is required'),
        proj_name: Yup.string().required('Project name is required'),
        pi: Yup.string().required('PI is required'),
        amt: Yup.number().typeError('Must be a number').required('Amount is required').positive().integer().min(0, 'Amount must be more than 0'),
        fund: Yup.string().required('Fund is required'),
        cpu: Yup.number().typeError('Must be a number').required('CPU hours is required').integer().min(0, 'CPU value must be more than 0'),
        gpu: Yup.number().typeError('Must be a number').required('GPU hours is required').integer().min(0, 'GPU value must be more than 0'),
        startDate: Yup.date().required('Start Date is required'),
        endDate: Yup.date().required('End Date is required').min(Yup.ref('startDate'), 'End date cannot be earlier than start date'),
        address: Yup.string().required('Address is required'),
        description: Yup.string().required('Description is required'),
      });
    
      const ldifToFormikMap = {
        displayname: 'displayName',
        username: 'userName',
        email: 'userEmail',
        organization: 'organization',
        gender: 'gender',
        mobile: 'mob_no',
        institute: 'institute',
        department: 'dept',
        designation: 'desg',
        domain: 'domain',
        subdomain: 'sub_domain',
        application: 'app',
        projectname: 'proj_name',
        pi: 'pi',
        amount: 'amt',
        funded: 'fund',
        cpuhours: 'cpu',
        gpuhours: 'gpu',
        'startdate(dd-mm-yyyy)': 'startDate',
        'enddate(dd-mm-yyyy)': 'endDate',
        address: 'address',
        description: 'description',
      };
    
      const parseLdifFile = (e, setValues) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log(file.name.substring(file.name.indexOf('.') + 1))
        if (file.name.substring(file.name.indexOf('.') + 1).includes('.')) {
          setValues({ ...initialValues });
          toast.error("not a valid file type");
          return;
        }
        if (file.name.substring(file.name.indexOf('.') + 1) !== 'ldif') {
          setValues({ ...initialValues });
          toast.error("only ldif files are allowed to upload");
          return;
        }
    
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result.trim();
          if (!content) {
            setValues({ ...initialValues });
            toast.warn("Blank file uploaded");
            return;
          }
          const lines = content.split('\n');
          const data = {};
    
          let validKeyFound = false;  // variable to check atleast one valid key should be present
    
          lines.forEach(line => {
            const [keyRaw, ...rest] = line.split(':');
            if (!keyRaw || rest.length === 0) return;
            const key = keyRaw.trim().toLowerCase();
            const value = rest.join(':').trim();
    
            // console.log(key)
    
    
            if (ldifToFormikMap[key]) {
    
              validKeyFound = true; // changing the variable state to true if a valid key is present in the file 
              const formikKey = ldifToFormikMap[key];
    
              if (formikKey === 'startDate' || formikKey === 'endDate') {
                const [dd, mm, yyyy] = value.split('-');
                data[formikKey] = `${yyyy}-${mm}-${dd}`;
              } else if (['cpu', 'gpu', 'amt', 'mob_no'].includes(formikKey)) {
                data[formikKey] = Number(value);
              } else {
                data[formikKey] = value;
              }
            }
          });
          if (!validKeyFound) {            // if ldif file doesnot contain any valid data restting the form to initial values
            setValues({ ...initialValues });
            toast.error("File doesn't contain valid LDIF data. Form has been reset.");
            return;
          }
    
          setValues({ ...initialValues, ...data });
          toast.success('LDIF file loaded successfully')
        };
    
        reader.readAsText(file);
        e.target.files[0].value = null;
      };
    
      const handleSubmit = async (values) => {
        setLoading(true);
        const formData = {
          ...values,
          mob_no: parseInt(values.mob_no),
          amt: parseInt(values.amt),
          cpu: parseInt(values.cpu),
          gpu: parseInt(values.gpu),
        };
    
        try {
          const response = await fetch(`${base_url}/ldap/add/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
    
          const result = await response.json();
          if (result.message === 'User already exists in LDAP') {
                      toast.warning('User already exists in LDAP');
          } else if (result.message === 'User added successfully to LDAP') {
            setStep(2);
                      toast.success('User created successfully in LDAP');
          } else {
                      toast.error('Error occurred in adding user in LDAP');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
                    toast.error('Something went wrong.');
          setStep(1);
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

    const [step, setStep] = useState(1);

    const steps = ['LDAP', 'SLURM Account', 'QOS', 'Disk Quota'];

    // Removed unused nextStep and prevStep functions as navigation buttons are no longer present
    // SLURM USERFORM.jsx
      const [uids, setUids] = useState([]);
      const [accounts, setAccounts] = useState([]);
      const [qos, setQos] = useState([]);
      const [formData, setFormData] = useState({
        uid: '',
        account: '',
        qos: ''
      });
    
      const base_urluser = 'http://10.208.23.139:8520';  //changed base_url to base_urluser because of ambiguity with the existing base_url of Ldap component
      useEffect(() => {
        const url =`${base_urluser}/slurm/ldap_list/`
        fetch(url,{
          method:'GET',
          headers:{
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            setUids(data.users.filter(user => user.uid));
            setAccounts(data.accounts || []);
            setQos(data.qos.filter(qos =>qos.name));
            console.log("Fetched data:", data);
          })
          .catch(error => {
                      toast.error("Failed to fetch data.");
            console.error('Error fetching UID/account list:', error);
          });
      }, [step]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const post_url=`${base_urluser}/slurm/user/add/`;
      const handleSubmituser = async (e) => {           //changed handlesubmit to handlesubmituser because of ambiguity with the existing handlesubmit of Ldap component
        e.preventDefault();
        console.log("Form submitted:", formData);
      
        try {
          const response = await fetch(post_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const result = await response.json();
      
          if (response.ok) {
                      toast.success('User added successfully in SLURM');
            console.log("Server response:", result);
            setStep(3);
            // navigate('/users_list'); 
          } else {
                      toast.error('Error occurred while adding user in SLURM');
            setStep(2)
            console.error("Error response from server:", result);
          }
      
        } catch (error) {
          console.error('Error submitting form:', error);
    
        }
      };
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const [accountsqos, setAccountsqos] = useState([]);
        const [qos1, setQos1] = useState([]);
        const [formDataqos, setFormDataqos] = useState({
            account: '',
            qos: ''
        });
    
    // const base_url = 'http://10.208.22.180:8520';
    const base_urlqos = 'http://10.208.23.139:8520';
    
        useEffect(() => {
            if(step === 3){
            const url = `${base_urlqos}/slurm/ldap_list`
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
    
                    setAccountsqos(data.accounts || []);
                    setQos1(data.qos.filter(qos => qos.name));
                    console.log("Fetched data:", data);
                })
                .catch(error => {
                              toast.error("Failed to fetch data.");
                    console.error('Error fetching UID/account list:', error);
                });}
        }, [step]);
    
        const handleChangeqos = (e) => {
            const { name, value } = e.target;
            setFormDataqos(prev => ({
                ...prev,
                [name]: value
            }));
        };
    
        const post_urlqos = `${base_url}/slurm/account/add-with-qos/`;
        const handleSubmitqos = async (e) => {
            e.preventDefault();
            console.log("Form submitted:", formData);
    
            try {
                const response = await fetch(post_urlqos, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                              toast.success('User added successfully in SLURM');
                    console.log("Server response:", result);
                    setStep(4);
                    // navigate('/users_list');
                } else {
                              toast.error('Error occurred while adding user in SLURM');
                    console.error("Error response from server:", result);
                    setStep(3);
                }
    
            } catch (error) {
                console.error('Error submitting form:', error);
    
            }
        };


    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h3>Quick User Setup</h3>
            </div>


            {/* Step Progress Bar */}
            <div className="step-progress d-flex align-items-center justify-content-between my-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = step === stepNumber;
                    const isCompleted = step > stepNumber;


                    return (
                        <div key={index} className="d-flex align-items-center flex-grow-1">
                            <div
                                className={`step-circle text-center rounded-circle me-2 ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-primary text-white' : 'bg-primary text-white'}`}
                                style={{ width: '40px', height: '40px', lineHeight: '40px' }}
                            >
                                {stepNumber}
                            </div>
                            <div className="me-2">{label}</div>
                            {index !== steps.length - 1 && (
                                <div className={`flex-grow-1 step-line ${isCompleted ? 'bg-primary' : 'bg-white'}`} style={{ height: '4px' }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            {step === 1 && (
                <div className="row">
                    <div className="col-12 col-md-10 px-0">
                        
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
                                  {({ values, setValues }) => (
                                    <>
                                      <Form>
                                        <div className="row shadow p-4" style={{ background: '#fff', borderRadius: '8px' }}>
                                          <h2 className="text-center mb-4">ADD USER TO LDAP</h2>
                        
                                          {/* LEFT COLUMN */}
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
                        
                                          {/* RIGHT COLUMN */}
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
                                          </div>
                        
                                          {/* LDIF File Upload */}
                                          <div className='d-flex flex-row justify-content-center'>
                                            <div className="mb-4 mt-4 d-flex flex-row" >
                                              {/* <label htmlFor="ldifUpload" className="form-label">Upload LDIF File To Auto Fill The Form:</label> */}
                                              <br />
                                              <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".ldif,.txt"
                                                className="form-control"
                                                onChange={(e) => parseLdifFile(e, setValues)}
                                                style={{ backgroundColor: 'white', maxWidth: '250px' }}
                                              />
                                            </div>
                                            <div className="mt-4">
                                              <button type="button" className="btn btn-primary ms-2 me-2" onClick={() => handlePreview(values)}>Preview</button>
                                              <button type="submit" className="btn btn-danger ms-2 me-2">Submit</button>
                                              <button type="reset" className="btn btn-secondary ms-2 me-2" onClick={() => {
                        
                                                if (fileInputRef.current) {
                                                  fileInputRef.current.value = null;
                                                }
                                              }}>Reset</button>
                                            </div>
                        
                                          </div>
                                          <div className="text-center mt-2">
                                            <p className="text-muted fs-5">
                                              <strong>Note:</strong> only<code>.ldif</code> files are allowed to upload.
                                            </p>
                                          </div>
                                        </div>
                        
                                      </Form>
                                    </>
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
                              <ToastContainer />
                            </>
                          
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="row">
                <div className="col-12 col-md-10 px-0">
                    <>
    <div className='container'>
    <div className="row justify-content-center  animate-fade-in-up custom-height">
      <div className="col-12 col-md-6 p-4 border rounded bg-light  form_div">
        <h1 className="mb-4 text-center">Add LDAP User to Slurm</h1>
        <form onSubmit={handleSubmituser}>
          <div className="mb-5">
            <label className="form-label">UserName:</label>
            <select
              required
              id="uid"
              name="uid"
              className="form-control"
              value={formData.uid}
              onChange={handleChange}
            >
              <option value="">Select from Ldap User List </option>
              {uids.length > 0 ? (
                uids.map((user, index) => (
                  <option key={index} value={user.uid}>{user.uid}</option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>

          <div className="mb-5">
            <label  className="form-label">Account:</label>
            <select
              required
              id="account"
              name="account"
              className="form-control"
              value={formData.account}
              onChange={handleChange}
            >
              <option value="">Select from Existing Accounts</option>
              {accounts.length > 0 ? (
                accounts.map((acct, index) => (
                  <option key={index} value={acct}>{acct}</option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>
          </div>
              <br />
          <div className="d-flex justify-content-center mt-5">
            <button type="submit" className="btn btn-primary w-50">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>
                </div>
                </div>
            )}

            {step === 3 && (
                <div className="row">
                <div className="col-md-10 px-0">
                    <>
            <div className='container'>
                <div className="row justify-content-center  animate-fade-in-up custom-height">
                    <div className="col-12 col-md-6 p-4 border rounded bg-light  form_div">
                        <h1 className="mb-4 text-center">Add Qos To Account</h1>
                        <form onSubmit={handleSubmitqos}>
                            <div className="mb-5">
                                <label className="form-label">Account:</label>
                                <select
                                    required
                                    id="account"
                                    name="account"
                                    className="form-control"
                                    value={formDataqos.account}
                                    onChange={handleChangeqos}
                                >
                                    <option value="">Select an Account</option>
                                    {accountsqos.length > 0 ? (
                                        accountsqos.map((acct, index) => (
                                            <option key={index} value={acct}>{acct}</option>
                                        ))
                                    ) : (
                                        <option disabled>Loading...</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-5">
                                <label className="form-label">Qos:</label>
                                <select

                                    id="qos"
                                    name="qos"
                                    className="form-control"
                                    value={formDataqos.qos}
                                    onChange={handleChangeqos}
                                >
                                    <option value="">Select an Qos</option>
                                    {qos1.length > 0 ? (
                                        qos1.map((q, index) => (
                                            <option key={q.id || index} value={q.name}>
                                                {q.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading...</option>
                                    )}
                                </select>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center mt-5">
                                <button type="submit" className="btn btn-primary w-50">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
                </div>
                </div>
            )}

            {step === 4 && (
                <div className="row">
                <div className="col-md-10 px-0">
                    <h4>Step 4: Disk Quota</h4>
                    <form>
                        <div className="mb-3">
                            <label>Disk Quota (GB)</label>
                            <input type="number" className="form-control" placeholder="Enter quota size" />
                        </div>
                    </form>
                </div>
                </div>
            )}

            {/* Navigation Buttons */}
            {/* Navigation Buttons removed as per user request */}
        </div>
    );
};

export default QuickUserSetup;
