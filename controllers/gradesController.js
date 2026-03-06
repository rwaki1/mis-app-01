const db = require('../config/db');

// Create a new grade
const addGrade = (req, res) => {
  const { grade_name } = req.body;

  if (!grade_name) {
    return res.status(400).json({ message: 'Grade name is required' });
  }

  const query = "INSERT INTO grades (grade_name) VALUES (?)";

  db.query(query, [grade_name], (err, result) => {
    if (err) {
      console.error('❌ Error adding grade:', err);
      return res.status(500).json({ message: 'Failed to add grade', error: err });
    }

    res.status(201).json({ message: '✅ Grade added successfully', gradeId: result.insertId });
  });
};

// Get all grades
const getGrades = (req, res) => {
  const query = "SELECT id, grade_name FROM grades";

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching grades:', err);
      return res.status(500).json({ message: 'Failed to fetch grades', error: err });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  addGrade,
  getGrades,
};
