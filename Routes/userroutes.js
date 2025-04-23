const express = require("express");
const { Protect, authorize } = require("../Middlewares/authmiddel");
const router = express.Router();

router.get("/admin", Protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.get("/user", Protect, (req, res) => {
  res.json({ message: "User access granted", user: req.user });
});

module.exports = router;
