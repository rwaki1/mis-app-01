import React, { useState, useEffect } from "react";
import "./AddPersonnelForm.css";
import PersonnelCard from "./PersonnelCard";

function AddPersonnelForm({ onAdd, grades, roles, regions, personnelList }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [armyNumber, setArmyNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [brigade, setBrigade] = useState("");
  const [battalion, setBattalion] = useState("");
  const [brigades, setBrigades] = useState([]);
  const [battalions, setBattalions] = useState([]);
  const [weaponSerialNumber, setWeaponSerialNumber] = useState("");
  const [radioSerialNumber, setRadioSerialNumber] = useState("");

  // Army search state
  const [armySearch, setArmySearch] = useState("");

  const armyMatch = personnelList.find(
    (p) => p.army_number?.toLowerCase() === armySearch.toLowerCase()
  );

  useEffect(() => {
    if (!region) {
      setBrigades([]);
      setBrigade("");
      setBattalions([]);
      setBattalion("");
      return;
    }
    fetch(`http://localhost:5000/api/brigades?region_id=${region}`)
      .then(res => res.json())
      .then(data => {
        setBrigades(data);
        setBrigade("");
        setBattalions([]);
        setBattalion("");
      })
      .catch(err => setBrigades([]));
  }, [region]);

  useEffect(() => {
    if (!brigade) {
      setBattalions([]);
      setBattalion("");
      return;
    }
    fetch(`http://localhost:5000/api/battalions?brigade_id=${brigade}`)
      .then(res => res.json())
      .then(data => {
        setBattalions(data);
        setBattalion("");
      })
      .catch(err => setBattalions([]));
  }, [brigade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("grade_id", grade);
    formData.append("status", status);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("army_number", armyNumber);
    if (photo) formData.append("photo", photo);
    formData.append("role_id", role);
    formData.append("region_id", region);
    formData.append("brigade_id", brigade);
    formData.append("battalion_id", battalion);
    formData.append("weapon_serial_number", weaponSerialNumber);
    formData.append("radio_serial_number", radioSerialNumber);

    try {
      const response = await fetch("http://localhost:5000/api/personnel", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to add personnel");
      const data = await response.json();
      onAdd(data);

      // reset form
      setName(""); setGrade(""); setStatus(""); setDateOfBirth("");
      setArmyNumber(""); setPhoto(null); setRole(""); setRegion("");
      setBrigade(""); setBattalion(""); setWeaponSerialNumber("");
      setRadioSerialNumber(""); setBrigades([]); setBattalions([]);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="add-personnel-fbi">
      <h2>Add New Personnel</h2>
      {/* Army Search Card OUTSIDE the form-and-search container */}
      <div className="army-search-card" style={{ marginBottom: "32px", maxWidth: 340 }}>
        <h3>Search by Army #</h3>
        <input
          type="text"
          value={armySearch}
          onChange={e => setArmySearch(e.target.value)}
          placeholder="Enter Army #"
        />
        {armyMatch && (
          <PersonnelCard person={armyMatch} />
        )}
      </div>
      {/* Form container */}
      <div
        className="form-and-search"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "32px",
        }}
      >
        <form className="form-grid" onSubmit={handleSubmit} style={{ flex: 1 }}>
          <label>Name: <input type="text" value={name} onChange={e => setName(e.target.value)} required /></label>
          <label>Grade:
            <select value={grade} onChange={e => setGrade(e.target.value)} required>
              <option value="">Select Grade</option>
              {grades.map(g => <option key={g.id} value={g.id}>{g.grade_name}</option>)}
            </select>
          </label>
          <label>Status:
            <select value={status} onChange={e => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <label>Date of Birth: <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required /></label>
          <label>Army #: <input type="text" value={armyNumber} onChange={e => setArmyNumber(e.target.value)} /></label>
          <label>Role:
            <select value={role} onChange={e => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
            </select>
          </label>
          <label>Region:
            <select value={region} onChange={e => setRegion(e.target.value)} required>
              <option value="">Select Region</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.region_name}</option>)}
            </select>
          </label>
          <label>Brigade:
            <select value={brigade} onChange={e => setBrigade(e.target.value)} required>
              <option value="">Select Brigade</option>
              {brigades.map(b => <option key={b.id} value={b.id}>{b.brigade_name}</option>)}
            </select>
          </label>
          <label>Battalion:
            <select value={battalion} onChange={e => setBattalion(e.target.value)} required>
              <option value="">Select Battalion</option>
              {battalions.map(b => <option key={b.id} value={b.id}>{b.battalion_name}</option>)}
            </select>
          </label>
          <label>Weapon SN: <input type="text" value={weaponSerialNumber} onChange={e => setWeaponSerialNumber(e.target.value)} /></label>
          <label>Radio SN: <input type="text" value={radioSerialNumber} onChange={e => setRadioSerialNumber(e.target.value)} /></label>
          <label>Photo: <input type="file" onChange={e => setPhoto(e.target.files[0])} accept="image/*" /></label>
          <button type="submit" className="fbi-btn">Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddPersonnelForm;