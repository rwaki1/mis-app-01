import React from "react";
import "./PersonnelCard.css";

function PersonnelCard({ person, onClick }) {
  return (
    <div className="personnel-card" onClick={onClick}>
      <div className="card-photo">
        {person.photoURL ? (
          <img
            src={person.photoURL}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              objectFit: "cover",
              border: "2px solid #ccc",
            }}
          />
        ) : (
          <div className="no-photo" style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px"
          }}>
            No Photo
          </div>
        )}
      </div>
      <div className="card-info">
        <h3>{person.name}</h3>
        <p><strong>Grade:</strong> {person.grade}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${person.status?.toLowerCase()}`}>
            {person.status}
          </span>
        </p>
        <p><strong>Date of Birth:</strong> {person.date_of_birth ? person.date_of_birth.slice(0, 10) : ""}</p>
        <p><strong>Army Number:</strong> {person.army_number}</p>
      </div>
    </div>
  );
}

export default PersonnelCard;