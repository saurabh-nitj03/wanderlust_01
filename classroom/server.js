const express = require("express");
const app = express();
const flash=require("connect-flash");
const path = require("path");

const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: "Mysupersecretstring",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req,res,next)=>{
    res.locals.messages=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let { name="anonymous" }=req.query;
    req.session.name=name;
    console.log(req.session.name);
    // console.log(req.session);
    // res.send(req.session.name);

    if(name==="anonymous") req.flash("error","some error ocurred user not registered");
   else  req.flash("success","user registered successfully"); /* flash message only one time*/
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.send(`hello ${req.session.name}`);
    // res.render("page.ejs" ,{name:req.session.name ,msg:req.flash("success")});
    // res.locals.messages=req.flash("success");
    // res.locals.error=req.flash("error");
    res.render("page.ejs" ,{name:req.session.name});
});
// app.get("/test", (req, r es) => {
//   res.send("test successful");
// });

// app.get("/requestcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     } else req.session.count=1;
//   res.send(`You send a request ${req.session.count} times`);
// });

app.listen(3000, () => {
  console.log("server is listening");
});
