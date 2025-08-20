
import { useState, useEffect } from "react"
import axios from "axios"

export default function RechargeComponent() {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [qosList, setQosList] = useState([])
  const [selectedQos, setSelectedQos] = useState("")
  const [openingBalance, setOpeningBalance] = useState([])
  const [creditedBalance, setCreditedBalance] = useState([])
  const [formType, setFormType] = useState("")
  const [formValues, setFormValues] = useState({
    cpuhours: "",
    gpuhours: "",
    billing: "",
  })
  const [confirmData, setConfirmData] = useState(null)

  // Fetch users
  useEffect(() => {
    axios
      .get(`${BASE_URL}/generateinvoice/getallusers/`)
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => console.error("Error fetching users", err))
  }, [BASE_URL])

  // Fetch QOS list for user
  useEffect(() => {
    if (!selectedUser) return
    axios
      .post(
        `${BASE_URL}/slurm/qos/getqosbyuser/`,
        { username: selectedUser },
        { headers: { "Content-Type": "application/json" } },
      )
      .then((res) => setQosList(res.data.output || []))
      .catch((err) => console.error("Error fetching QOS", err))
  }, [selectedUser, BASE_URL])

  // Fetch balances
  useEffect(() => {
    if (!selectedQos) return
    axios
      .get(`${BASE_URL}/slurm/qos/getopeningbalance?qos=${selectedQos}`)
      .then((res) => setOpeningBalance(res.data.data || []))
      .catch((err) => console.error("Error fetching opening balance", err))

    axios
      .get(`${BASE_URL}/slurm/qos/getcreditedbalance?qos=${selectedQos}`)
      .then((res) => setCreditedBalance(res.data.data || []))
      .catch((err) => console.error("Error fetching credited balance", err))
  }, [selectedQos, BASE_URL])

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault()
    const payload = {
      qos_name: selectedQos,
      cpuhours: formType === "cpu" || formType === "cpugpu" ? formValues.cpuhours : "",
      gpuhours: formType === "gpu" || formType === "cpugpu" ? formValues.gpuhours : "",
      billing: formType === "billing" ? formValues.billing : "",
      selected: formType,
    }
    setConfirmData({ type: formType, values: payload })
  }

  const confirmRecharge = () => {
    axios
      .post(`${BASE_URL}/slurm/qos/rechargeuser/`, confirmData.values)
      .then(() => {
        alert("Recharge successful!")
        setFormType("")
        setFormValues({ cpuhours: "", gpuhours: "", billing: "" })
        setConfirmData(null)
      })
      .catch(() => {
        alert("Recharge failed")
      })
  }

  const buttonsDisabled = !selectedUser || !selectedQos

  return (
    <div
      className="app-wrapper app-container min-vh-100 mt-0"
      style={{ background: "linear-gradient(135deg, #7ce5ffff, #5cc6faff)" }}
    >
      {/* <div className="container bg-light rounded shadow p-4"       style={{ background: "linear-gradient(135deg, #1e3c72, #7c99ccff)" }}
> */}
      <h1 className=" text-center text-primary fw-bold mt-5">Recharge QOS</h1>

      {/* User and QOS Selection */}
      <div className=" card mt-5 shadow-sm border-0 " style={{ borderRadius: "1.5rem", backgroundColor: "#f8f9fa" }}>
        <div className="mb-3 p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-secondary">Select User</label>
              <select
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            {qosList.length > 0 && (
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary">Select QOS</label>
                <select
                  className="form-select"
                  value={selectedQos}
                  onChange={(e) => setSelectedQos(e.target.value)}
                >
                  <option value="">Select QOS</option>
                  {qosList.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balances */}
      {selectedQos && (
        <div className="row ">
          <div className="col-md-6" >
            <div className="card shadow-sm border-0   text-white fw-bold" style={{ borderRadius: "1rem", backgroundColor: "#f8f9fa" }}>
              <div className="text-dark d-flex justify-content-center align-items-center"><h5>Opening Balance</h5></div>
              <div className=" p-2 fade-in">
                <table className="table table-bordered table-hover table-sm text-center align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>QoS</th>
                      <th>CPU</th>
                      <th>GPU</th>
                      <th>Billing</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openingBalance.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.qos}</td>
                        <td style={{ color: item.cpu_opening_hours < 0 ? "red" : item.cpu_opening_hours > 0 ? "green" : "black" }}>{item.cpu_opening_hours}</td>
                        <td style={{ color: item.gpu_opening_hours < 0 ? "red" : item.gpu_opening_hours > 0 ? "green" : "black" }}>{item.gpu_opening_hours}</td>
                        <td style={{ color: item.billing_opening_balance < 0 ? "red" : item.billing_opening_balance > 0 ? "green" : "black" }}>{item.billing_opening_balance}</td>
                        <td>{new Date(item.datetime).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm border-0" style={{ borderRadius: "1rem", backgroundColor: "#f8f9fa" }}>
              <div className="text-dark d-flex justify-content-center align-items-center"><h5>Credited Balance</h5></div>
              <div className=" p-2 fade-in">
                <table className="table table-bordered table-hover table-sm text-center align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>QoS</th>
                      <th>CPU</th>
                      <th>GPU</th>
                      <th>Billing</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditedBalance.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.qos}</td>
                        <td style={{ color: item.cpu_credited_hours < 0 ? "red" : item.cpu_credited_hours > 0 ? "green" : "black" }}>{item.cpu_credited_hours}</td>
                        <td style={{ color: item.gpu_credited_hours < 0 ? "red" : item.gpu_credited_hours > 0 ? "green" : "black" }}>{item.gpu_credited_hours}</td>
                        <td style={{ color: item.billing_credited_balance < 0 ? "red" : item.billing_credited_balance > 0 ? "green" : "black" }}>{item.billing_credited_balance}</td>
                        <td>{new Date(item.datetime).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}
  
      {/* Recharge Buttons */}
      <div className=" card shadow-sm border-0 " style={{ borderRadius: "1rem", backgroundColor: "#f8f9fa" }}>
        <div className=" mb-3 p-3">
          <h5 className="fw-bold text-secondary">Recharge Options</h5>
          <div className="row g-2">
            <div className="col">
              <button
                className={`btn w-100 ${formType === "cpu" ? "btn-primary" : "btn-outline-primary"
                  }`}
                disabled={buttonsDisabled}
                onClick={() => setFormType("cpu")}
              >
                Add CPU Minutes
              </button>
            </div>
            <div className="col">
              <button
                className={`btn w-100 ${formType === "gpu" ? "btn-success" : "btn-outline-success"
                  }`}
                disabled={buttonsDisabled}
                onClick={() => setFormType("gpu")}
              >
                Add GPU Minutes
              </button>
            </div>
            <div className="col">
              <button
                className={`btn w-100 ${formType === "cpugpu" ? "btn-warning text-dark" : "btn-outline-warning"
                  }`}
                disabled={buttonsDisabled}
                onClick={() => setFormType("cpugpu")}
              >
                Add CPU and GPU Minutes
              </button>
            </div>
            <div className="col">
              <button
                className={`btn w-100 ${formType === "billing" ? "btn-info text-dark" : "btn-outline-info"
                  }`}
                disabled={buttonsDisabled}
                onClick={() => setFormType("billing")}
              >
                Add Billing Amount
              </button>
            </div>
          </div>

          {/* Form */}
          {formType && (
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3">
                {(formType === "cpu" || formType === "cpugpu") && (
                  <div className="col-md-6">
                    <label className="form-label">Enter CPU Minutes</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formValues.cpuhours}
                      onChange={(e) =>
                        setFormValues({ ...formValues, cpuhours: e.target.value })
                      }
                      required
                    />
                  </div>
                )}
                {(formType === "gpu" || formType === "cpugpu") && (
                  <div className="col-md-3">
                    <label className="form-label">Enter GPU Minutes</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formValues.gpuhours}
                      onChange={(e) =>
                        setFormValues({ ...formValues, gpuhours: e.target.value })
                      }
                      required
                    />
                  </div>
                )}
                {formType === "billing" && (
                  <div className="col-md-6">
                    <br />
                    <label className="form-label">Add Billing Amount in Paisa</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formValues.billing}
                      onChange={(e) =>
                        setFormValues({ ...formValues, billing: e.target.value })
                      }
                      required
                    />
                  </div>
                )}
              {/* </div> */}
              <div className="col-md-3 d-flex align-items-end">
                <button type="submit" className="btn btn-success  w-100">
                  Submit
                </button>
            </div>
          </div>
              </form>
            )}
      </div>
    </div>

        {/* Confirmation Modal */ }
  {
    confirmData && (
      <div className="modal show fade d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Confirm Recharge</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setConfirmData(null)}
              ></button>
            </div>
            <div className="modal-body">
              <p className="fw-semibold">
                Are you sure you want to add{" "}
                <span className="text-primary">
                  {formType === "cpu" && `${confirmData.values.cpuhours} CPU hours`}
                  {formType === "gpu" && `${confirmData.values.gpuhours} GPU hours`}
                  {formType === "cpugpu" &&
                    `${confirmData.values.cpuhours} CPU hours and ${confirmData.values.gpuhours} GPU hours`}
                  {formType === "billing" && `${confirmData.values.billing} Billing hours`}
                </span>{" "}
                to <span className="text-success">{selectedUser}</span> with{" "}
                <span className="text-warning">{selectedQos}</span>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmData(null)}
              >
                Cancel
              </button>
              <button className="btn btn-success px-4" onClick={confirmRecharge}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  {/* </div> */ }
  <br />
  <br />
  <br />
  <br />
    </div >
  )
}
