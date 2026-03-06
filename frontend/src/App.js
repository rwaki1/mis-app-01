import React, { useState, useEffect } from "react";
import "./App.css";
import AddPersonnelForm from "./components/AddPersonnelForm";
import PersonnelCard from "./components/PersonnelCard";
import axios from "axios";

// BulkUploadForm component
function BulkUploadForm({ onUploadSuccess }) {
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csv", csvFile);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/personnel/upload-csv`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setMessage(`Successfully uploaded ${data.insertedCount || data.length || "records"}.`);
      setCsvFile(null);

      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setMessage("Error uploading CSV: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>
      {message && <span style={{ color: message.startsWith("Error") ? "red" : "green" }}>{message}</span>}
    </form>
  );
}

function App() {
  const [personnelList, setPersonnelList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showStatusCount, setShowStatusCount] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const [grades, setGrades] = useState([]);
  const [roles, setRoles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const openInspector = (person) => {
    setSelectedPerson(person);
    setInspectorOpen(true);
  };

  const closeInspector = () => {
    setSelectedPerson(null);
    setInspectorOpen(false);
  };

  const fetchData = async () => {
    try {
      const personnelRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/personnel`);
      const updatedPersonnel = personnelRes.data.map((p) => ({
        ...p,
        photoURL: p.photo ? `${process.env.REACT_APP_API_URL}/uploads/${p.photo}` : null,
        grade: p.grade_name || p.grade || "",
        role: p.role_name || p.role || "",
        region: p.region_name || p.region || "",
        region_id: p.region_id || null,
        brigade: p.brigade_name || p.brigade || "",
        battalion: p.battalion_name || p.battalion || "",
      }));
      setPersonnelList(updatedPersonnel);
      setActiveCount(updatedPersonnel.filter((p) => p.status === "Active").length);
      setInactiveCount(updatedPersonnel.filter((p) => p.status === "Inactive").length);

      const [gradesRes, rolesRes, regionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/grades`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/roles`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/regions`),
      ]);

      setGrades(gradesRes.data || []);
      setRoles(rolesRes.data || []);
      setRegions(regionsRes.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Always add photoURL when adding new personnel
  const handleAddPersonnel = (newPerson) => {
    const photoURL = newPerson.photo ? `${process.env.REACT_APP_API_URL}/uploads/${newPerson.photo}` : null;
    const updatedList = [...personnelList, { ...newPerson, photoURL }];
    setPersonnelList(updatedList);
    setActiveCount(updatedList.filter((p) => p.status === "Active").length);
    setInactiveCount(updatedList.filter((p) => p.status === "Inactive").length);
  };

  const filteredList = personnelList.filter((person) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatches = person.name?.toLowerCase().includes(searchLower) || false;
    const gradeMatches = person.grade?.toLowerCase().includes(searchLower) || false;
    const statusMatches = !filterStatus || person.status === filterStatus;
    const regionMatches = !filterRegion || person.region_id === parseInt(filterRegion, 10);

    return (nameMatches || gradeMatches) && statusMatches && regionMatches;
  });

  const PersonnelList = ({ personnelList, viewMode }) => {
    if (viewMode === "table") {
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Date of Birth</th>
              <th>Role</th>
              <th>Region</th>
              <th>Brigade</th>
              <th>Battalion</th>
              <th>Weapon SN</th>
              <th>Radio SN</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {personnelList.map((person, index) => (
              <tr key={index} onClick={() => openInspector(person)} className="clickable-row">
                <td>{person.name}</td>
                <td>{person.grade}</td>
                <td>
                  <span style={{ color: person.status === "Active" ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}>
                    {person.status}
                  </span>
                </td>
                <td>{person.date_of_birth}</td>
                <td>{person.role}</td>
                <td>{person.region}</td>
                <td>{person.brigade}</td>
                <td>{person.battalion}</td>
                <td>{person.weapon_serial_number}</td>
                <td>{person.radio_serial_number}</td>
                <td>
                  {person.photoURL ? (
                    <img
                      src={person.photoURL}
                      alt="Profile"
                      style={{
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
        {personnelList.map((person, index) => (
          <PersonnelCard key={index} person={person} onClick={() => openInspector(person)} />
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-container">
          <img src="/lion-de-sarambwe.jpg" alt="Logo" className="logo" />
          <span className="logo-text">LION DE SARAMBWE MIS</span>
        </div>
      </header>

      <AddPersonnelForm
        onAdd={handleAddPersonnel}
        grades={grades}
        roles={roles}
        regions={regions}
        isLoading={isLoading}
        personnelList={personnelList}
      />

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Search by name or grade"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "220px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginLeft: "10px" }}
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.region_name || region.name}
            </option>
          ))}
        </select>
      </div>

      <div className="button-container" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <BulkUploadForm onUploadSuccess={fetchData} />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setViewMode("table")} className={viewMode === "table" ? "active" : ""}>
            Table View
          </button>
          <button onClick={() => setViewMode("cards")} className={viewMode === "cards" ? "active" : ""}>
            Card View
          </button>
          <button onClick={() => setShowStatusCount((prev) => !prev)}>
            {showStatusCount ? "Hide Status Count" : "Show Status Count"}
          </button>
        </div>
      </div>

      {showStatusCount && (
        <div className="status-count" style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Status Count</h3>
          <p>Active Personnel: {activeCount}</p>
          <p>Inactive Personnel: {inactiveCount}</p>
        </div>
      )}

      <div className="personnel-list">
        <PersonnelList personnelList={filteredList} viewMode={viewMode} />
      </div>

      {inspectorOpen && selectedPerson && (
        <div className="inspector-overlay" onClick={closeInspector}>
          <div className="inspector-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeInspector}>
              ×
            </button>
            <h2>{selectedPerson.name}</h2>
            {selectedPerson.photoURL && <img src={selectedPerson.photoURL} alt="Profile" className="inspector-photo" />}
            <ul>
              <li><strong>Grade:</strong> {selectedPerson.grade}</li>
              <li><strong>Status:</strong> {selectedPerson.status}</li>
              <li><strong>Date of Birth:</strong> {selectedPerson.date_of_birth}</li>
              <li><strong>Role:</strong> {selectedPerson.role}</li>
              <li><strong>Region:</strong> {selectedPerson.region}</li>
              <li><strong>Brigade:</strong> {selectedPerson.brigade}</li>
              <li><strong>Battalion:</strong> {selectedPerson.battalion}</li>
              <li><strong>Army Number:</strong> {selectedPerson.army_number}</li>
              <li><strong>Weapon SN:</strong> {selectedPerson.weapon_serial_number}</li>
              <li><strong>Radio SN:</strong> {selectedPerson.radio_serial_number}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;