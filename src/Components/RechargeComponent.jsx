import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RechargeComponent.css";

export default function RechargeComponent() {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [qosList, setQosList] = useState([]);
  const [selectedQos, setSelectedQos] = useState("");

  const [openingBalance, setOpeningBalance] = useState([]);
  const [creditedBalance, setCreditedBalance] = useState([]);

  const [formType, setFormType] = useState(""); // cpu, gpu, cpugpu, billing
  const [formValues, setFormValues] = useState({
    cpuhours: "",
    gpuhours: "",
    billing: ""
  });

  const [confirmData, setConfirmData] = useState(null);

  // Fetch users
  useEffect(() => {
    axios
      .get(`${BASE_URL}/generateinvoice/getallusers/`)
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((err) => console.error("Error fetching users", err));
  }, [BASE_URL]);

  // Fetch QOS list for user (dummy data for now)
  useEffect(() => {
    if (!selectedUser) return;

    // Dummy qos for testing
    const dummyQos = ["normal", "high", "premium"];
    setQosList(dummyQos);

    // For real API, uncomment:
    /*
    axios
      .post(`${BASE_URL}/surm/qos/getqosbyuser`, { username: selectedUser })
      .then((res) => setQosList(res.data.data || []))
      .catch((err) => console.error("Error fetching QOS", err));
    */
  }, [selectedUser, BASE_URL]);

  // Fetch balances
  useEffect(() => {
    if (!selectedQos) return;

    axios
      .get(`${BASE_URL}/surm/qos/getopeningbalance?qos=${selectedQos}`)
      .then((res) => setOpeningBalance(res.data || []))
      .catch((err) => console.error("Error fetching opening balance", err));

    axios
      .get(`${BASE_URL}/surm/qos/getcreditedbalance?qos=${selectedQos}`)
      .then((res) => setCreditedBalance(res.data || []))
      .catch((err) => console.error("Error fetching credited balance", err));
  }, [selectedQos, BASE_URL]);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    let payload = {
      cpuhours: formType === "cpu" || formType === "cpugpu" ? formValues.cpuhours : "",
      gpuhours: formType === "gpu" || formType === "cpugpu" ? formValues.gpuhours : "",
      billing: formType === "billing" ? formValues.billing : "",
      selected: formType
    };

    setConfirmData({
      type: formType,
      values: payload
    });
  };

  // Confirm recharge
  const confirmRecharge = () => {
    axios
      .post(`${BASE_URL}/surm/qos/rechargeuser`, confirmData.values)
      .then(() => {
        alert("Recharge successful!");
        setFormType("");
        setFormValues({ cpuhours: "", gpuhours: "", billing: "" });
        setConfirmData(null);
      })
      .catch((err) => {
        console.error("Recharge failed", err);
        alert("Recharge failed");
      });
  };

  // Button disable logic
  const buttonsDisabled = !selectedUser || !selectedQos;

  // Handle button click (reset confirmData on change)
  const handleButtonClick = (type) => {
    setFormType(type);
    setFormValues({ cpuhours: "", gpuhours: "", billing: "" });
    setConfirmData(null); // hide confirmation when changing button
  };

  return (
    <div
      className="container justify-content-center align-content-center"
      style={{
        marginTop: "100px",
        marginLeft: "300px",
        marginBottom: "200px",
        backgroundColor: "#e1e6e2ff",
        width: "700px",
        borderRadius: "25px"
      }}
    >
      <h2 className="title">Recharge QOS</h2>

      {/* Dropdowns */}
      <div className="selectors">
        <select
          className="dropdown"
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

        {qosList.length > 0 && (
          <select
            className="dropdown"
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
        )}
      </div>

      {/* Balances */}
      {openingBalance.length > 0 && creditedBalance.length > 0 && (
        <div className="tables-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Opening Balance</th>
              </tr>
            </thead>
            <tbody>
              {openingBalance.map((item, i) => (
                <tr key={i}>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Credited Balance</th>
              </tr>
            </thead>
            <tbody>
              {creditedBalance.map((item, i) => (
                <tr key={i}>
                  <td>{item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buttons */}
      <div className="buttons">
        <button
          disabled={buttonsDisabled}
          className={formType === "cpu" ? "active" : ""}
          onClick={() => handleButtonClick("cpu")}
        >
          Add CPU Hours
        </button>
        <button
          disabled={buttonsDisabled}
          className={formType === "gpu" ? "active" : ""}
          onClick={() => handleButtonClick("gpu")}
        >
          Add GPU Hours
        </button>
        <button
          disabled={buttonsDisabled}
          className={formType === "cpugpu" ? "active" : ""}
          onClick={() => handleButtonClick("cpugpu")}
        >
          Add CPU + GPU Hours
        </button>
        <button
          disabled={buttonsDisabled}
          className={formType === "billing" ? "active" : ""}
          onClick={() => handleButtonClick("billing")}
        >
          Add Billing Hours
        </button>
      </div>

      {/* Form */}
      {formType && (
        <form onSubmit={handleFormSubmit} className="form-section">
          {formType === "cpu" && (
            <input
              type="number"
              placeholder="CPU Hours"
              value={formValues.cpuhours}
              onChange={(e) =>
                setFormValues({ ...formValues, cpuhours: e.target.value })
              }
              required
            />
          )}
          {formType === "gpu" && (
            <input
              type="number"
              placeholder="GPU Hours"
              value={formValues.gpuhours}
              onChange={(e) =>
                setFormValues({ ...formValues, gpuhours: e.target.value })
              }
              required
            />
          )}
          {formType === "cpugpu" && (
            <>
              <input
                type="number"
                placeholder="CPU Hours"
                value={formValues.cpuhours}
                onChange={(e) =>
                  setFormValues({ ...formValues, cpuhours: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="GPU Hours"
                value={formValues.gpuhours}
                onChange={(e) =>
                  setFormValues({ ...formValues, gpuhours: e.target.value })
                }
                required
              />
            </>
          )}
          {formType === "billing" && (
            <input
              type="number"
              placeholder="Billing Hours"
              value={formValues.billing}
              onChange={(e) =>
                setFormValues({ ...formValues, billing: e.target.value })
              }
              required
            />
          )}
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}

      {/* Confirmation */}
      {confirmData && (
        <div className="confirm-box">
          <p>
            Are you sure you want to add{" "}
            <strong>
              {formType === "cpu" && `${confirmData.values.cpuhours} CPU hours`}
              {formType === "gpu" && `${confirmData.values.gpuhours} GPU hours`}
              {formType === "cpugpu" &&
                `${confirmData.values.cpuhours} CPU hours and ${confirmData.values.gpuhours} GPU hours`}
              {formType === "billing" &&
                `${confirmData.values.billing} Billing hours`}
            </strong>{" "}
            to <strong>{selectedUser}</strong> with{" "}
            <strong>{selectedQos}</strong>?
          </p>
          <div>
            <button className="yes-btn" onClick={confirmRecharge}>
              Yes
            </button>
            <button className="no-btn" onClick={() => setConfirmData(null)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}






























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./RechargeComponent.css";

// export default function RechargeComponent() {
//   const BASE_URL = process.env.REACT_APP_BACKEND_URL;

//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [qosList, setQosList] = useState([]);
//   const [selectedQos, setSelectedQos] = useState("");

//   const [openingBalance, setOpeningBalance] = useState([]);
//   const [creditedBalance, setCreditedBalance] = useState([]);

//   const [formType, setFormType] = useState(""); // cpu, gpu, cpugpu, billing
//   const [formValues, setFormValues] = useState({
//     cpuhours: "",
//     gpuhours: "",
//     billing: ""
//   });

//   const [confirmData, setConfirmData] = useState(null);

//   // Fetch users
//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/generateinvoice/getallusers/`)
//       .then((res) => {
//         setUsers(res.data.users || []);
//       })
//       .catch((err) => console.error("Error fetching users", err));
//   }, [BASE_URL]);

//   // Fetch QOS list for user
//   useEffect(() => {
//     if (!selectedUser) return;
//     axios
//       .post(`${BASE_URL}/surm/qos/getqosbyuser`, { username: selectedUser })
//       .then((res) => setQosList(res.data.data || []))
//       .catch((err) => console.error("Error fetching QOS", err));
//   }, [selectedUser, BASE_URL]);

//   // Fetch balances for QOS
//   useEffect(() => {
//     if (!selectedQos) return;
//     axios
//       .get(`${BASE_URL}/surm/qos/getopeningbalance?qos=${selectedQos}`)
//       .then((res) => setOpeningBalance(res.data || []))
//       .catch((err) => console.error("Error fetching opening balance", err));

//     axios
//       .get(`${BASE_URL}/surm/qos/getcreditedbalance?qos=${selectedQos}`)
//       .then((res) => setCreditedBalance(res.data || []))
//       .catch((err) => console.error("Error fetching credited balance", err));
//   }, [selectedQos, BASE_URL]);

//   // Handle form submission
//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     let payload = {
//       cpuhours: formType === "cpu" || formType === "cpugpu" ? formValues.cpuhours : "",
//       gpuhours: formType === "gpu" || formType === "cpugpu" ? formValues.gpuhours : "",
//       billing: formType === "billing" ? formValues.billing : "",
//       selected: formType
//     };

//     setConfirmData({
//       type: formType,
//       values: payload
//     });
//   };

//   // Confirm recharge
//   const confirmRecharge = () => {
//     axios
//       .post(`${BASE_URL}/surm/qos/rechargeuser`, confirmData.values)
//       .then(() => {
//         alert("Recharge successful!");
//         setFormType("");
//         setFormValues({ cpuhours: "", gpuhours: "", billing: "" });
//         setConfirmData(null);
//       })
//       .catch((err) => {
//         console.error("Recharge failed", err);
//         alert("Recharge failed");
//       });
//   };

//   // Button disable logic
//   const buttonsDisabled = !selectedUser || !selectedQos;

//   return (
//     <div
//       className="container justify-content-center align-content-center"
//       style={{
//         marginTop: "100px",
//         marginLeft: "300px",
//         marginBottom: "200px",
//         backgroundColor: "#e1e6e2ff",
//         width: "700px",
//         borderRadius: "25px"
//       }}
//     >
//       <h2 className="title">Recharge QOS</h2>

//       {/* Dropdowns */}
//       <div className="selectors">
//         <select
//           className="dropdown"
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//         >
//           <option value="">Select User</option>
//           {users.map((u) => (
//             <option key={u} value={u}>
//               {u}
//             </option>
//           ))}
//         </select>

//         {qosList.length > 0 && (
//           <select
//             className="dropdown"
//             value={selectedQos}
//             onChange={(e) => setSelectedQos(e.target.value)}
//           >
//             <option value="">Select QOS</option>
//             {qosList.map((q) => (
//               <option key={q} value={q}>
//                 {q}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>

//       {/* Balances */}
//       {openingBalance.length > 0 && creditedBalance.length > 0 && (
//         <div className="tables-container">
//           <table className="styled-table">
//             <thead>
//               <tr>
//                 <th>Opening Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {openingBalance.map((item, i) => (
//                 <tr key={i}>
//                   <td>{item}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <table className="styled-table">
//             <thead>
//               <tr>
//                 <th>Credited Balance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {creditedBalance.map((item, i) => (
//                 <tr key={i}>
//                   <td>{item}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Buttons */}
//       <div className="buttons">
//         <button
//           disabled={buttonsDisabled}
//           className={formType === "cpu" ? "active" : ""}
//           onClick={() => setFormType("cpu")}
//         >
//           Add CPU Hours
//         </button>
//         <button
//           disabled={buttonsDisabled}
//           className={formType === "gpu" ? "active" : ""}
//           onClick={() => setFormType("gpu")}
//         >
//           Add GPU Hours
//         </button>
//         <button
//           disabled={buttonsDisabled}
//           className={formType === "cpugpu" ? "active" : ""}
//           onClick={() => setFormType("cpugpu")}
//         >
//           Add CPU + GPU Hours
//         </button>
//         <button
//           disabled={buttonsDisabled}
//           className={formType === "billing" ? "active" : ""}
//           onClick={() => setFormType("billing")}
//         >
//           Add Billing Hours
//         </button>
//       </div>

//       {/* Form */}
//       {formType && (
//         <form onSubmit={handleFormSubmit} className="form-section">
//           {formType === "cpu" && (
//             <input
//               type="number"
//               placeholder="CPU Hours"
//               value={formValues.cpuhours}
//               onChange={(e) =>
//                 setFormValues({ ...formValues, cpuhours: e.target.value })
//               }
//               required
//             />
//           )}
//           {formType === "gpu" && (
//             <input
//               type="number"
//               placeholder="GPU Hours"
//               value={formValues.gpuhours}
//               onChange={(e) =>
//                 setFormValues({ ...formValues, gpuhours: e.target.value })
//               }
//               required
//             />
//           )}
//           {formType === "cpugpu" && (
//             <>
//               <input
//                 type="number"
//                 placeholder="CPU Hours"
//                 value={formValues.cpuhours}
//                 onChange={(e) =>
//                   setFormValues({ ...formValues, cpuhours: e.target.value })
//                 }
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="GPU Hours"
//                 value={formValues.gpuhours}
//                 onChange={(e) =>
//                   setFormValues({ ...formValues, gpuhours: e.target.value })
//                 }
//                 required
//               />
//             </>
//           )}
//           {formType === "billing" && (
//             <input
//               type="number"
//               placeholder="Billing Hours"
//               value={formValues.billing}
//               onChange={(e) =>
//                 setFormValues({ ...formValues, billing: e.target.value })
//               }
//               required
//             />
//           )}
//           <button type="submit" className="submit-btn">
//             Submit
//           </button>
//         </form>
//       )}

//       {/* Confirmation */}
//       {confirmData && (
//         <div className="confirm-box">
//           <p>
//             Are you sure you want to add{" "}
//             <strong>
//               {formType === "cpu" && `${confirmData.values.cpuhours} CPU hours`}
//               {formType === "gpu" && `${confirmData.values.gpuhours} GPU hours`}
//               {formType === "cpugpu" &&
//                 `${confirmData.values.cpuhours} CPU hours and ${confirmData.values.gpuhours} GPU hours`}
//               {formType === "billing" &&
//                 `${confirmData.values.billing} Billing hours`}
//             </strong>{" "}
//             to <strong>{selectedUser}</strong> with{" "}
//             <strong>{selectedQos}</strong>?
//           </p>
//           <div>
//             <button className="yes-btn" onClick={confirmRecharge}>
//               Yes
//             </button>
//             <button className="no-btn" onClick={() => setConfirmData(null)}>
//               No
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }