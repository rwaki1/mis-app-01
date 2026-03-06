const db = require('../config/db');

// Create a new role
const addRole = (req, res) => {
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ message: 'Role name is required' });
  }

  const query = "INSERT INTO roles (role_name) VALUES (?)";

  db.query(query, [role_name], (err, result) => {
    if (err) {
      console.error('❌ Error adding role:', err);
      return res.status(500).json({ message: 'Failed to add role', error: err });
    }
    res.status(201).json({ message: '✅ Role added successfully', roleId: result.insertId });
  });
};

// Get all roles
const getRoles = (req, res) => {
  const query = "SELECT id, role_name FROM roles";

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching roles:', err);
      return res.status(500).json({ message: 'Failed to fetch roles', error: err });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  addRole,
  getRoles
};
