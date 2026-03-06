const db = require('../config/db');

// Get battalions, optionally filtered by brigade_id
const getBattalions = (req, res) => {
  const brigadeId = req.query.brigade_id;

  let query = "SELECT * FROM battalions";
  let params = [];

  if (brigadeId) {
    query += " WHERE brigade_id = ?";
    params.push(brigadeId);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching battalions:', err);
      return res.status(500).json({ message: 'Failed to fetch battalions', error: err });
    }
    
    const processedResults = results.map(battalion => ({
      ...battalion,
      battalion_name: battalion.battalion_name || "Not assigned"
    }));

    res.status(200).json(processedResults);
  });
};

// Add a new battalion
const addBattalion = (req, res) => {
  const { battalion_name, brigade_id } = req.body;

  if (!battalion_name) {
    return res.status(400).json({ message: "Battalion name is required" });
  }

  const query = `
    INSERT INTO battalions (battalion_name, brigade_id)
    VALUES (?, ?)
  `;

  db.query(query, [battalion_name, brigade_id || null], (err, result) => {
    if (err) {
      console.error('❌ Error inserting battalion:', err);
      return res.status(500).json({ message: 'Failed to add battalion', error: err });
    }

    res.status(201).json({ message: '✅ Battalion added successfully', battalionId: result.insertId });
  });
};

module.exports = {
  getBattalions,
  addBattalion,
};
