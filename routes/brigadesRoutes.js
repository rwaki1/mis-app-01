const express = require('express');
const router = express.Router();
const brigadesController = require('../controllers/brigadesController');

//GET: Fetch all brigades
router.get('/', brigadesController.getBrigades);

//POST: Add a new brigade
router.post('/', brigadesController.addBrigade);



module.exports = router;
