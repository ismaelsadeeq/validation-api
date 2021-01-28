var express = require('express');
var router = express.Router();

const controller = require('../controllers/home.controller');

router.get('/',controller.getData);
router.post('/validate-rule', controller.validate);

module.exports = router;
