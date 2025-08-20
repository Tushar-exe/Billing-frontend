
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Gauge, User } from "lucide-react";

const AddQosToUser = () => {
    const navigate = useNavigate();

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
                    navigate('/slurm/users_list');
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
        <>
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
        </>
    );
};

export default AddQosToUser;
