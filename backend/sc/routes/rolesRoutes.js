const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

router.get('/', rolesController.getRoles);
router.post('/', rolesController.addRole);

module.exports = router;
