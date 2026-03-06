const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');

router.get('/', gradesController.getGrades);
router.post('/', gradesController.addGrade);

module.exports = router;
