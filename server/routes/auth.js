const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//signup route
router.put(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
          return Promise.resolve(); // Resolve the Promise if no user found
        });
      })
      .normalizeEmail(),
    check("password").trim().isLength({ min: 5 }),
    check("name").trim().not().isEmpty(),
  ],
  authController.signUp
);

//login route
router.post("/login", authController.login);

//get user status route
router.get("/status", isAuth, authController.getUserStatus);

// update user status route
router.put(
  "/status",
  isAuth,
  [check("status").trim().not().isEmpty()],
  authController.patchUserStatus
);

module.exports = router;
