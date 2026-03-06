const express = require('express');
const router = express.Router();
const regionsController = require('../controllers/regionsController');

router.get('/', regionsController.getRegions);
router.post('/', regionsController.addRegion);


module.exports = router;
