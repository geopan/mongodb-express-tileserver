'use strict';

var express = require('express');
var ctrl = require('./suburb.controller');

var router = express.Router();

router.get('/', ctrl.index);
router.get('/:id', ctrl.show);
router.get('/tile/:z/:x/:y.:format', ctrl.tile);

module.exports = router;
