const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get( userController.renderSignUpForm)
.post( wrapAsync(userController.signUp));

router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local", { failureFlash: '/login', failureFlash: true }),userController.Login);


router.get("/logout", userController.Logout)

module.exports = router;