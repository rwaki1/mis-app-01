import React, { useState } from "react";

function BulkUploadForm() {
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setError("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csv", csvFile);

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/personnel/upload-csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      setMessage(`✅ Successfully uploaded ${result.insertedCount || "records"}.`);
      setCsvFile(null);
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>Bulk Upload Personnel (CSV)</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
        <br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default BulkUploadForm;
