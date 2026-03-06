const express = require('express');
const router = express.Router();
const battalionsController = require('../controllers/battalionsController');

//GET: Fetch all battalions
router.get('/', battalionsController.getBattalions);

//POST: Add a new battalion
router.post('/', battalionsController.addBattalion);

module.exports = router;
