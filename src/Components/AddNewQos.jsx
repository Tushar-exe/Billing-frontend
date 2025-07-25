import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


const AddNewQos = () => {
    const [formData, setFormData] = useState({
        qos_name: "",
        billing_amount: "",
        grptresrunmins: "46080",
        maxsubmitjobperuser: "10",
        flags: "nodecay",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const base_url=`http://paramrudra.pune.cdac.in:8520`

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        const response = await fetch(`${base_url}/slurm/qos/add/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log(response)
            alert("QoS created successfully!");
            navigate("/qos");
        } else {
            alert("Error creating QoS.");
        }
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center  animate-fade-in-up custom-height">
                    <div className="col-12 col-md-6 p-3 border rounded bg-light form_div">
                        <h1 className="mb-3 text-center">Add New QoS</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">QoS Name</label>
                                <input
                                    type="text"
                                    name="qos_name"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Billing Amount (in minutes)</label>
                                <input
                                    type="number"
                                    name="billing_amount"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.billing_amount}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">GrpTRESRun Minutes</label>
                                <input
                                    type="number"
                                    name="grptresrunmins"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.grptresrunmins}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Max Submit Jobs Per User</label>
                                <input
                                    type="number"
                                    name="maxsubmitjobperuser"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.maxsubmitjobperuser}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Flags</label>
                                <select
                                    name="flags"
                                    className="form-select"
                                    onChange={handleChange}
                                    value={formData.flags}
                                >                                  
                                    <option value="nodecay">nodecay</option>
                                    <option value="deny">deny</option>
                                    <option value="overrun">overrun</option>
                                    {/* Add more flags as needed */}
                                </select>
                            </div>

                            <div className="d-flex justify-content-center">
                                <button
                                    className="btn btn-primary w-50 d-flex justify-content-center align-items-center"
                                    onClick={handleSubmit}
                                >
                                    Create QoS
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddNewQos;
