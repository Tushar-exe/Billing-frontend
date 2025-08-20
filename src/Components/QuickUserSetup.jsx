
import React, { useState } from 'react';
import Ldap from './Ldap';
import UserForm from './UserForm';
import { useEffect } from 'react';
import AccountWithQos from './AccountWithQos';
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import check1 from '../Assets/check1.gif';
import { Plus, Users, Gauge, User } from "lucide-react";

const QuickUserSetup = () => {

    // Ldap states
      const [showModal, setShowModal] = useState(false);
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      // const base_url = `http://paramrudra.pune.cdac.in:8520`;
        const base_url = process.env.REACT_APP_BACKEND_URL;
      const [showSuccess,setShowSuccess] = useState(false);
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
              setShowSuccess(true);
              setMessage("User added successfully to LDAP!")
              setTimeout(function() {
                setShowSuccess(false);
                setStep(2);
                setMessage('');
              }, 3000);            
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
    const [message,setMessage] = useState('');
    const steps = ['LDAP', 'SLURM Account', 'QOS'];

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
    
      const base_urluser = `${base_url}`;  //changed base_url to base_urluser because of ambiguity with the existing base_url of Ldap component
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
            setShowSuccess(true);
              setMessage("User successfully added to SLURM!")
              setTimeout(function() {
                setShowSuccess(false);
                setStep(3);
                setMessage('');
              }, 3000);
            // setStep(3);
            // navigate('/users_list'); 
          } else {
                      toast.error('Error occurred while adding user in SLURM');
            setStep(2)
            console.error("Error response from server:", result);
          }
      
        } catch (error) {
          setShowSuccess(false);
          setMessage("");
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
    const base_urlqos = `${base_url}`;  //changed base_url to base_urlqos because of ambiguity with the existing base_url of Ldap component
    
        useEffect(() => {
            if(step === 3){
            const url = `${base_urlqos}/slurm/user_and_qos`
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
                     setShowSuccess(true);
              setMessage("QOS assigned successfully")
              setTimeout(function() {
                setShowSuccess(false);
                setStep(4);
                setMessage('');
                navigate('/slurm/users_list');
              }, 3000);
                    // setStep(4);
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

// >>>>>>>>>>>>>>>>>>>Step 3 >>>>>>>>>>>>>>>>>>>>>>>>>
const [users, setUsers] = useState([]);
    const [qosstep3, setQosstep3] = useState([]);
    const [formDatastep3, setFormDatastep3] = useState({
        username: '', 
        qos: ''
    });
    const [qosData, setQosData] = useState([]);
    const [qosInfo, setQosInfo] = useState({
        name: '',
        grp_tres_mins: '',
        grp_tres_run_mins: '',
        max_submit_jobs_per_user: 0,
    });

    const base_urlstep3 = process.env.REACT_APP_BACKEND_URL;

    // Fetch users & qos from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Base URL:", base_urlstep3); // debug

                const url = `${base_urlstep3}/slurm/user_and_qos/`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched data:", data); // debug

                setQosData(data.qos || []);
                setUsers(data.users || []);
                setQosstep3((data.qos || []).filter(qos => qos.name));

            } catch (error) {
                alert("Failed to fetch data.");
                console.error('Error fetching Slurm Users and qos list:', error);
            }
        };

        fetchData();
    }, [base_urlstep3]);

    // Handle user/qos dropdown changes
    const handleChangestep3 = (e) => {
        const { name, value } = e.target;
        setFormDatastep3(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQosChange3 = (e) => {
        const value = e.target.value;

        if (value === "") {
            setQosInfo({
                name: "NA",
                grp_tres_mins: "NA",
                grp_tres_run_mins: "NA",
                max_submit_jobs_per_user: "NA"
            });
            setFormDatastep3(prev => ({ ...prev, qos: "" }));
            return;
        }

        setFormDatastep3(prev => ({ ...prev, qos: value }));

        const qosUpdatedData = qosData.find(qos => qos.name === value);
        if (qosUpdatedData) {
            setQosInfo({
                name: qosUpdatedData.name,
                grp_tres_mins: qosUpdatedData.grp_tres_mins,
                grp_tres_run_mins: qosUpdatedData.grp_tres_run_mins,
                max_submit_jobs_per_user: qosUpdatedData.max_submit_jobs_per_user
            });
        }
    };

    // Submit selected qos to backend
    const handleSubmitstep3 = async (e) => {
        e.preventDefault();
        if(formDatastep3.username.trim() === "" || formDatastep3.qos.trim() === "")
        {
            toast.error("Please fill all the fields correctly")
            // console.log("Invalida Data")
            return;
        }
        console.log("Form submitted:", formDatastep3);

        const post_urlstep3 = `${base_urlstep3}/slurm/add_qos_to_user/`;

        try {
            const response = await fetch(post_urlstep3, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDatastep3),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Qos added successfully to the user');
                console.log("Server response:", result);
                setTimeout(() => {
                    navigate('/users_list');
                }, 2000);
            } else {
                alert('Error occurred while adding user in SLURM');
                console.error("Error response from server:", result);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    


    return (
        <div className="container mt-5">
          {showSuccess && (
            <div className="alert alert-success text-center" role="alert" style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '80%', maxWidth: '400px' }}>
              <h3>{message}</h3>
              <img src={check1} alt=""/>
            </div>
          )}
            <div className="text-center mb-4">
                <h3>Quick User Setup</h3>
            </div>


            {/* Step Progress Bar */}
            <div className="step-progress d-flex align-items-center justify-content-between my-4" style={{ background: '#f8f9fa', borderRadius: 8, padding: '16px 12px' }}>
                
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = step === stepNumber;
                    const isCompleted = step > stepNumber;
                    return (
                        <div key={index} className="d-flex align-items-center flex-grow-1">
                            <div
                                className={`step-circle text-center rounded-circle me-2 ${isActive ? 'bg-primary text-white shadow' : isCompleted ? 'bg-success text-white shadow' : 'bg-light text-secondary border'}`}
                                style={{ width: '40px', height: '40px', lineHeight: '40px', fontWeight: 600, fontSize: 20, border: isActive ? '2px solid #0d6efd' : isCompleted ? '2px solid #198754' : '2px solid #dee2e6', transition: 'all 0.2s' }}
                            >
                                {isCompleted ? <span style={{ color: 'white', fontSize: 22, verticalAlign: 'middle' }}>&#10003;</span> : stepNumber}
                            </div>
                            <div className="me-2" style={{ fontWeight: isActive ? 600 : 400, color: isActive ? '#0d6efd' : isCompleted ? '#198754' : '#6c757d' }}>{label}</div>
                            {index !== steps.length - 1 && (
                                <div className={`flex-grow-1 step-line ${isCompleted ? 'bg-success' : isActive ? 'bg-primary' : 'bg-secondary'}`} style={{ height: '4px', borderRadius: 2, opacity: 0.5 }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            {step === 1 && (
                <div className="row">
                    <div className="col-12 px-0">
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
                                            </div>
                                            <div className='d-flex flex-row justify-content-center'>
                                                <div className="mb-4 mt-4 d-flex flex-row" >
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
                                                {/* <div className="mt-4">
                                                    <button type="button" className="btn btn-primary ms-2 me-2" onClick={() => handlePreview(values)}>Preview</button>
                                                    <button type="submit" className="btn btn-danger ms-2 me-2">Submit</button>
                                                    <button type="reset" className="btn btn-secondary ms-2 me-2" onClick={() => {
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = null;
                                                        }
                                                    }}>Reset</button>
                                                </div> */}
                                                <div className="mt-4 d-flex flex-row">
                      <button type="button" className="btn btn-primary ms-2 me-2 p-0" onClick={() => handlePreview(values)}>Preview</button>
                      <button type="submit" className="btn btn-danger ms-2 me-2" style={{height:'40px'}}>Submit</button>
                      <button type="reset" className="btn btn-secondary ms-2 me-2" style={{height:'40px'}} onClick={() => {

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
              <div className='container' style={{ marginBottom: '150px' }}>
                <div className="row justify-content-center animate-fade-in-up custom-height">
                    <div className="col-12 col-md-6 p-4 border rounded bg-light form_div">
                        <div className='d-flex flex-row m-4 align-content-center justify-content-center '>
                        <div className='mt-2 d-flex flex-row'>
                            <Gauge size={44}/><h1 className="mb-4 text-center" style={{marginLeft:'15px',marginBottom:'10px'}}>Add Qos To User</h1>
                        </div>
                        </div>
                        <form onSubmit={handleSubmitstep3}>
                            
                            {/* User Dropdown */}
                            <div className="mb-5">
                                 <Users size={24}/><label className="form-label m-2"> USERNAME :</label>
                                <select
                                    required
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    value={formDatastep3.username}
                                    onChange={handleChangestep3}
                                >
                                    <option value="">Select an Existing Slurm User</option>
                                    {users.length > 0 ? (
                                        users.map((acct, index) => (
                                            <option key={index} value={acct}>{acct}</option>
                                        ))
                                    ) : (
                                        <option disabled>Loading...</option>
                                    )}
                                </select>
                            </div>

                            {/* Qos Dropdown */}
                            <div className="mb-5">
                                <Gauge size={24}/><label className="form-label m-2">QOS :</label>
                                <select
                                    id="qos"
                                    name="qos"
                                    className="form-control"
                                    value={formDatastep3.qos}
                                    onChange={handleQosChange3}
                                >
                                    <option value="">Select an Existing Qos</option>
                                    {qosstep3.length > 0 ? (
                                        qosstep3.map((q, index) => (
                                            <option key={q.id || index} value={q.name}>
                                                {q.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading...</option>
                                    )}
                                </select>

                            </div>

                            {/* Qos Details Card */}
                            {qosInfo && qosInfo.name && (
                                <div className="card shadow-sm my-4 mx-auto" style={{ maxWidth: 400, borderRadius: 16, background: '#e7f1f9ff' }}>
                                    <div className="card-body">
                                        <h5 className="card-title text-dark mb-3" style={{ fontWeight: 600 }}>SELECTED QOS Details</h5>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item" style={{ background: '#e7f1f9ff', fontSize: '15px' }}><strong>Name:</strong> {qosInfo.name}</li>
                                            <li className="list-group-item" style={{ background: '#e7f1f9ff', fontSize: '15px' }}><strong>Grp Tres Mins:</strong> {qosInfo.grp_tres_mins}</li>
                                            <li className="list-group-item" style={{ background: '#e7f1f9ff', fontSize: '15px' }}><strong>Grp Tres Run Mins:</strong> {qosInfo.grp_tres_run_mins}</li>
                                            <li className="list-group-item" style={{ background: '#e7f1f9ff', fontSize: '15px' }}><strong>Max Submit Jobs/User:</strong> {qosInfo.max_submit_jobs_per_user}</li>
                                        </ul>
                                    </div>

                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="d-flex flex-row justify-content-center mt-2">
                                <button type="submit" className='btn btn-primary w-50' style={{marginRight:'15px'}}><Plus size={18}/>Make new Qos</button>
                                <button type="submit" className="btn btn-primary w-50">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
            )}


            {/* {step === 4 && (
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
            )} */}

            {/* Navigation Buttons */}
            {/* Navigation Buttons removed as per user request */}
        </div>
    );
};

export default QuickUserSetup;
