const db = require('../config/db'); // ✅ use shared connection

const multer = require('multer');
const path = require('path');

db.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to the database!');
});

// 📁 Setup multer for file uploads (stored in /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Helper to normalize empty strings to null
const normalizeId = (id) => {
  if (!id || id === '') return null;
  return id;
};

// ➕ Add personnel and military assignment using stored procedure
const addPersonnel = (req, res) => {
  const {
    name,
    grade_id,
    status,
    date_of_birth,
    army_number,
    role_id,
    region_id,
    brigade_id,
    battalion_id,
    weapon_serial_number,
    radio_serial_number,
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  // Adjust the procedure name and parameters list if needed
  const procedureCall = `
    CALL AddPersonnel(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    procedureCall,
    [
      name,
      normalizeId(grade_id),
      status,
      date_of_birth || '1970-01-01',
      army_number,
      photo,
      normalizeId(role_id),
      normalizeId(region_id),
      normalizeId(brigade_id),
      normalizeId(battalion_id),
      weapon_serial_number || null,
      radio_serial_number || null
    ],
    (err, results) => {
      if (err) {
        console.error('❌ Error calling stored procedure:', err);
        return res.status(500).json({ message: 'Failed to add personnel via procedure', error: err });
      }

      res.status(201).json({
        message: '✅ Personnel and assignment added successfully via procedure',
        photo,
      });
    }
  );
};

// 🔍 Get all personnel with related data (no change)
const getPersonnel = (req, res) => {
  const query = `
    SELECT
      p.id,
      p.name,
      p.date_of_birth,
      p.status,
      p.photo,
      p.army_number,
      g.grade_name,
      r.role_name,
      reg.region_name,
      b.brigade_name,
      bat.battalion_name,
      m.weapon_serial_number,
      m.radio_serial_number
    FROM personnel p
    LEFT JOIN grades g ON p.grade_id = g.id
    LEFT JOIN military_assignments m ON p.army_number = m.army_number
    LEFT JOIN roles r ON m.role_id = r.id
    LEFT JOIN regions reg ON m.region_id = reg.id
    LEFT JOIN brigades b ON m.brigade_id = b.id
    LEFT JOIN battalions bat ON m.battalion_id = bat.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching personnel:', err);
      return res.status(500).json({ message: 'Failed to fetch personnel', error: err });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  upload,
  addPersonnel,
  getPersonnel,
};
