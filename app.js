if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const listing = require("./models/listing.js");
const reviews = require("./models/reviews.js");

const mongo = require("mongoose");
  const path = require("path");
const method = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

const listingRouter = require ("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const flash=require("connect-flash");
const session = require("express-session");
const passport=require("passport");
const local=require("passport-local");
const user=require("./models/user.js");

const sessionOpt={
  secret:"Mysecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+1000*7*24*60*60,
    maxAge:1000*7*24*60*60, /*in ms*/
    httpOnly:true
  },
}

app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(method("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

async function main() {
  mongo.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then((res) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/", (req, res) => {
  res.send("this is root directory");
});



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new user({
//     email:"abc@gmail.com",
//     username:"student"
//   })
//  const newuser=await user.register(fakeUser,"helloworld");
//  res.send(newuser);
// })


// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   console.log(error);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     console.log(errMsg);
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// // index route
// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     const allListings = await listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   })
// );
// app.get(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listingData = await listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listingData });
//   })
// );

// app.get("/listing/add", (req, res) => {
//   // res.send("add request working");
//   res.render("listings/add.ejs");
// });

// app.post(
//   "/listings",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     //    let result= listingSchema.validate(req.body);
//     //    console.log(result);
//     //    if(result.error){
//     //     throw new ExpressError(400,result.error);
//     //    }
//     let { title, image, description, price, location, country } = req.body;
//     await listing.create({
//       title,
//       image,
//       description,
//       price,
//       location,
//       country,
//     });
//     res.redirect("/listings");
//   })
// );

// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listingData = await listing.findById(id);
//     res.render("listings/edit.ejs", { listingData });
//   })
// );

// app.put(
//   "/listings/:id/edit",
//   validateListing,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let { title, description, price, location, country } = req.body;
//     //   if(!title||!description||!price||!location||!country){
//     //     throw new ExpressError(400,"send some valid data for listing");
//     // }
//     await listing.findByIdAndUpdate(id, {
//       title: title,
//       description: description,
//       price: price,
//       location: location,
//       country: country,
//     });
//     res.redirect(`/listings/${id}`);
//   })
// );

// app.delete(
//   "/listings/:id/del",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     // let list = await listing.findById(id);
//     // for(r of list.reviews){
//     //   await reviews.findByIdAndDelete(r);
//     // }
//     await listing.findByIdAndDelete(id);
//     res.redirect("/listings");
//   })
// );

// reveiws

// app.post(
//   "/listings/:id/reviews",
//   validateReview,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listingData = await listing.findById(id);
//     let rev = req.body.reviews;
//     let newReview = new reviews(rev);
//     await newReview.save();
//     listingData.reviews.push(newReview);
//     await listingData.save();
//     console.log("new review saved");
//     res.redirect(`/listings/${id}`);
//   })
// );

// // Delete post route for review deletion

// app.delete(
//   "/listings/:id/reviews/:reviewId",
//   wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;
//     // pull operator is used to modify database of existing content
//     // pull operator justs pull that id from rveiews array of  listings
//     await listing.findByIdAndUpdate(id, {
//       $pull: {
//         reviews: reviewId,
//       },
//     });
//     await reviews.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
//   })
// );

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  //   res.send("something went wrong");
  let { statusCode = 500, message = "some error ocurred" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening at 8080");
});
