// src/components/UploadCsv.js
import React, { useState } from 'react';

const UploadCsv = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('http://localhost:5000/api/personnel/import/csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`CSV imported successfully! Rows inserted: ${data.rowsInserted}`);
      } else {
        alert('Error importing CSV');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error importing CSV');
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2>Upload Personnel CSV</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Choose CSV file: </label>
          <input type="file" accept=".csv" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload CSV</button>
      </form>
    </div>
  );
};

export default UploadCsv;
