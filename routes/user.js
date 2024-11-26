const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } =require("../middleware.js");

const userController=require("../controller/user.js")
// const method = require("method-override");
// const app=express();
// app.use(method("_method"));

router.route("/signup")
      .get( userController.renderSignupForm )
      .post(wrapAsync(userController.signUp));

// router.get("/signup", userController.renderSignupForm );

// router.post(
//   "/signup",
//   wrapAsync(userController.signUp)
// );

router.route("/login")
      .get(userController.renderLoginForm)
      .post(saveRedirectUrl,
        passport.authenticate("local", {
          failureRedirect: "/login",
          failureFlash: true,
        }),
        userController.login
      );

// router.get("/login",userController.renderLoginForm);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

router.get("/logout",userController.logout)

module.exports = router;
 