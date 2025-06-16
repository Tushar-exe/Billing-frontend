import React, { useEffect, useState } from "react";

  const LdapUserUpdater = () => {
  const [users, setUsers] = useState([]);
  const [selectedUid, setSelectedUid] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const base_url = 'http://192.168.200.131:8520';

  // Fetch list of LDAP users on mount
  useEffect(() => {
    const url =`${base_url}/slurm/ldap_list/`
    fetch(url,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())
      .then(data =>{
        console.log(data);
        setUsers(data.users.filter(user => user.uid));

      })
      .catch(console.error);
  }, []);

  // When user is selected, fetch details
  const handleUserSelect = async (uid) => {
    setSelectedUid(uid);
    setLoading(true);
    try {
      const res = await fetch(`/api/ldap-users/${uid}`); // Replace with actual backend endpoint
      const data = await res.json();
      setUserDetails(data);
      setEditForm(data); // Clone for editing
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedUid) return;
    try {
      const res = await fetch("/api/ldap-users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: selectedUid, fields: editForm }),
      });
      const result = await res.json();
      alert(result.status === "USER_UPDATE_SUCCESS" ? "✅ User updated!" : "❌ Update failed!");
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Update failed due to server error.");
    }
  };

  return (
    
    <div className="container mt-4">
    <div className="p-6 space-y-6">
      {/* Dropdown for user selection */}
      <div>
        <br />
        <h2 className="text-center mb-4">LDAP User Details</h2>
        <label className="block mb-1 font-medium">Select LDAP User:</label>
        <select
          className="w-full border rounded p-2"
          onChange={(e) => handleUserSelect(e.target.value)}
          value={selectedUid || ""}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.uid} value={user.uid}>
              {user.displayName || user.uid}
            </option>
          ))}
        </select>
      </div>

      {/* Dual pane view for selected user */}
      {loading ? (
        <div className="text-gray-600">Loading user data...</div>
      ) : userDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Pane: View current user info */}
          <div className="bg-gray-50 border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Current Info</h2>
            <div className="space-y-1 text-sm">
              {Object.entries(userDetails).map(([k, v]) => (
                <div key={k}>
                  <span className="font-semibold">{k}</span>: {v}
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Edit form */}
          <div className="bg-white border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Edit User Fields</h2>

            {/* Example Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  value={editForm.userEmail || ""}
                  onChange={(e) => handleInputChange("userEmail", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Mobile</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={editForm.mob_no || ""}
                  onChange={(e) => handleInputChange("mob_no", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={editForm.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              {/* Add more fields as needed */}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update User
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default LdapUserUpdater;
