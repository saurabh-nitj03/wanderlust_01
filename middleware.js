const listing =require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const { listingSchema } = require("./schema.js");
const reviews = require("./models/reviews.js");
module.exports.isLoggedIn =(req,res,next)=>{
    // console.log(req.path , ' ' , req.originalUrl);
    if(!req.isAuthenticated()){
        // redirect url needs to be saved here
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error","you must be logged in to add new listing");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id} =req.params;
    let list= await listing.findById(id);
    if(res.locals.currentUser && !list.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error" , "You are not the owner of this listing")
     return  res.redirect(`/listings/${id}`);
   }
   next();
}
module.exports.isAuthor=async(req,res,next)=>{
    let {id, reviewId} =req.params;
    let review= await reviews.findById(reviewId);
    if(res.locals.currentUser && !review.author.equals(res.locals.currentUser._id)){
      req.flash("error" , "You are not the owner of this Review")
     return  res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      console.log(errMsg);
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };