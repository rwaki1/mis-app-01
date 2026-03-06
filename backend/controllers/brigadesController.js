const db = require('../config/db');

// Get brigades, optionally filtered by region_id
const getBrigades = (req, res) => {
  const regionId = req.query.region_id;

  let query = "SELECT * FROM brigades";
  let params = [];

  if (regionId) {
    query += " WHERE region_id = ?";
    params.push(regionId);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching brigades:', err);
      return res.status(500).json({ message: 'Failed to fetch brigades', error: err });
    }
    
    const processedResults = results.map(brigade => ({
      ...brigade,
      brigade_name: brigade.brigade_name || "Not assigned"
    }));

    res.status(200).json(processedResults);
  });
};

// Add a new brigade
const addBrigade = (req, res) => {
  const { brigade_name, region_id } = req.body;

  if (!brigade_name) {
    return res.status(400).json({ message: "Brigade name is required" });
  }

  const query = `
    INSERT INTO brigades (brigade_name, region_id)
    VALUES (?, ?)
  `;

  db.query(query, [brigade_name, region_id || null], (err, result) => {
    if (err) {
      console.error('❌ Error inserting brigade:', err);
      return res.status(500).json({ message: 'Failed to add brigade', error: err });
    }

    res.status(201).json({ message: '✅ Brigade added successfully', brigadeId: result.insertId });
  });
};

module.exports = {
  getBrigades,
  addBrigade,
};
