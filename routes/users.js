var express = require('express');
var router = express.Router();
const controller = require('../controllers/user.controller');

/* GET users listing. */
router.post('/',controller.addData);

module.exports = router;
