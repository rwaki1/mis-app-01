const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const personnelController = require('../controllers/personnelController');

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    // Use timestamp + original extension
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ➕ POST: Add new personnel with photo
router.post('/', upload.single('photo'), personnelController.addPersonnel);

// 🔍 GET: Fetch all personnel with details
router.get('/', personnelController.getPersonnel);

// 📌 GET: Fetch brigades by region
router.get('/brigades', personnelController.getBrigadesByRegion);

// 📌 GET: Fetch battalions by brigade
router.get('/battalions', personnelController.getBattalionsByBrigade);

module.exports = router;
