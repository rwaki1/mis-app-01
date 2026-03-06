import React from 'react';
import PersonnelCard from './PersonnelCard';
import './PersonnelDashboard.css';

// Example list of personnel (you would fetch this from your API/database)
const personnelList = [
  {
    name: "Lt. Sarah Mensah",
    grade: "OF-2",
    date_of_birth: "1990-03-14",
    deployment: "Peacekeeping - Sector 7",
    unit: "4th Infantry Division",
    status: "Active",
    photo_url: "/images/sarah.jpg"
  },
  {
    name: "Capt. James Owusu",
    grade: "OF-3",
    date_of_birth: "1985-06-01",
    deployment: "Northern Border",
    unit: "Armored Division",
    status: "On Leave",
    photo_url: "/images/james.jpg"
  },
  {
    name: "Sgt. Amina Sule",
    grade: "OR-5",
    date_of_birth: "1993-11-22",
    deployment: "Special Ops",
    unit: "Recon Unit",
    status: "Injured",
    photo_url: "/images/amina.jpg"
  },
  // Add more as needed...
];

const PersonnelDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Personnel Dashboard</h2>
      <div className="grid-container">
        {personnelList.map((person, index) => (
          <PersonnelCard key={index} data={person} />
        ))}
      </div>
    </div>
  );
};

export default PersonnelDashboard;
