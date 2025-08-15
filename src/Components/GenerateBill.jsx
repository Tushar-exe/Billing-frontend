import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GenerateBill = () => {
  const [formData, setFormData] = useState({
    username: "",
    starttime: "",
    endtime: ""
  });
  // const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

    const base_url = process.env.REACT_APP_BACKEND_URL;


  // MMDDYY format validation
  const validateDate = (dateStr) => /^\d{6}$/.test(dateStr);

  const [loading, setLoading] = useState(false);

  const [users,setUsers] = useState([]);

  const validateUsername = (username) => { return true};

  const [user,setUser] = useState("");

  const handleChange = (e) => {
    if(e.target.name === 'username'){
      setUser(e.target.value);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // setError("");
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let { username, starttime, endtime } = formData;

    // Convert yyyy-mm-dd to mmddyy format
    const convertToMMDDYY = (dateStr) => {
      if (!dateStr) return "";
      const [yyyy, mm, dd] = dateStr.split("-");
      if (yyyy && mm && dd) {
        return `${mm}${dd}${yyyy.slice(-2)}`;
      }
      return dateStr;
    };
    
    starttime = convertToMMDDYY(starttime);
    endtime = convertToMMDDYY(endtime);

    if (!validateUsername(username)) {
      toast.error("Invalid username.");
      // setError("Invalid username. Use 3-30 alphanumeric characters or underscores.");
      return;
    }
    if (!validateDate(starttime) || !validateDate(endtime)) {
      toast.error("Dates must be in MMDDYY format.");
      // setError("Dates must be in MMDDYY format.");
      return;
    }

    try {
      const response = await axios.post(`${base_url}/generateinvoice/bill/`, { username, starttime, endtime }, {
        responseType: "blob"
      });
      // Download PDF automatically dont download
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL); // Save for manual download
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      // link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Error generating bill: " + (err.response?.data || err.message));
      // setError("Error generating bill: " + (err.response?.data || err.message));
      setPdfUrl("");
    }
  };

  const [showiframe, setShowIframe] = useState(false);

  const handleiframview = () =>{
    setShowIframe(!showiframe);
    if(pdfUrl === ""){
      toast.error("Please generate the bill first.");
      return;
    }
    if(pdfUrl && !showiframe){
      // toast.success("Viewing the generated bill.");
    } else {
      // toast.info("Hiding the generated bill.");
    }
  }

  useEffect(() => {
      axios.get(`${base_url}/generateinvoice/getallusers/`)
      .then(response => {
        if (response.data) {
          console.log(response.data.users);
          setUsers(response.data.users); 
          // console.log(users)
         }
      })
      .catch(error => {
        toast.error("Error fetching users: " + (error.response?.data || error.message));
        setUsers([]);
      })   
  }, []);

  useEffect(() => {
    console.log("Updated users:", users);
  }, [users]);

  return (
    <>
    <br />
    <br />
    <div className=" mt-5 animated-container" style={{ width: 'auto'}}>
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '600px', height:'400px' }}>
        <h3 className="text-center mb-4 text-primary"><strong>GENERATE USER BILL</strong></h3>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center mb-3">
            <div className="col-12 d-flex align-items-center mb-3 justify-content-center">
              <label className="form-label fw-bold mb-0 me-3">
                Username :
              </label>
              <select
                onChange={handleChange}
                name="username"
                className="form-select"
                style={{ maxWidth: '300px' }}
                placeholder="Enter username"
                value={formData.username}
                required
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-3 gap-3">
            <div className="col-4">
              <label className="form-label fw-bold">Start Date :</label>
              <input
                type="date"
                name="starttime"
                value={formData.starttime}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-4">
              <label className="form-label fw-bold">End Date :</label>
              <input
                type="date"
                name="endtime"
                value={formData.endtime}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
            <button className="btn btn-success px-4" type="submit">
              Generate Bill
            </button>
            {pdfUrl && (
              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `${user}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download PDF
              </button>
            )}
            <button className="btn btn-primary px-4" type="button" onClick={handleiframview}>
              {showiframe ? `Hide` : 'View'}
            </button>
          </div>
        </form>

        {/* {error && <div className="alert alert-danger mt-3 text-center">{error}</div>} */}
      </div>

      {showiframe && (
        <div className="text-center mt-3 pt-5">
          <iframe
            src={pdfUrl}
            title="Generated Bill"
            style={{ width: '80%', height: '500px', border: 'none' }}
          ></iframe>
        </div>
      )}
    </div>
          {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <div className="text-white mt-2">Generating Bill... Please wait</div>
        </div>
      )}
          <ToastContainer />
      <br />
      <br />
      <br />
    </>
  );
};

export default GenerateBill;

