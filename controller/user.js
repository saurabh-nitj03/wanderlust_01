const user=require("../models/user.js")

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }
module.exports.signUp= async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new user({ email, username });
      const reguser = await user.register(newuser, password);
      console.log(reguser);
      req.login(reguser,(err)=>{
          if(err){
              return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }
  module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login=async (req, res) => {
    req.flash("success","Login Successfully , Welocme to Wanderlust");
    // res.send("Welocme to Wanderlust , you are logged in");
    console.log(res.locals.redirectUrl);
   if(res.locals.redirectUrl) res.redirect(res.locals.redirectUrl);
   else res.redirect("/listings");  
  }
  module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    })
}