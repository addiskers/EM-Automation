const express = require("express");
const { getFreshworksContact, updateFreshworksContact } = require("../controllers/freshworksController");

const router = express.Router();

router.get("/lookup", getFreshworksContact);
router.put("/update/:id", updateFreshworksContact);

module.exports = router;
