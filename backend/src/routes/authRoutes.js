const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");

// Rotas públicas
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty().trim(),
  ],
  validate,
  register,
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validate,
  login,
);

// Rotas protegidas
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteAccount);
router.post("/logout", auth, logout);

module.exports = router;
