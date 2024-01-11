// to use router provided by express.js 
const express = require("express");
const router = express.Router();

router.get("/", (req,res) => res.json({"signal": "pink"}));

module.exports = router

