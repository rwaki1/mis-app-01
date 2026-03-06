const db = require('../config/db');

// Get all regions (with fallback for null region_name)
const getRegions = (req, res) => {
  const query = "SELECT * FROM regions";

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching regions:', err);
      return res.status(500).json({ message: 'Failed to fetch regions', error: err });
    }

    const processedResults = results.map(region => ({
      ...region,
      region_name: region.region_name || "Not assigned"
    }));

    res.status(200).json(processedResults);
  });
};

// Add a new region
const addRegion = (req, res) => {
  const { region_name } = req.body;

  if (!region_name) {
    return res.status(400).json({ message: 'Region name is required' });
  }

  const query = "INSERT INTO regions (region_name) VALUES (?)";

  db.query(query, [region_name], (err, result) => {
    if (err) {
      console.error('❌ Error adding region:', err);
      return res.status(500).json({ message: 'Failed to add region', error: err });
    }

    res.status(201).json({ message: '✅ Region added successfully', regionId: result.insertId });
  });
};

module.exports = {
  getRegions,
  addRegion,
};
