const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminCtr");

router.get('/passwordSet',adminController.passwordSet);

module.exports = router;