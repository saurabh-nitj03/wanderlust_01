const express= require("express");
const router = express.Router({mergeParams :true }); /* use to merge parent route info to child route */

const reviews = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js" );
const { validateReview, isLoggedIn ,isAuthor}=require("../middleware.js")

const reviewController=require("../controller/review.js")
// new review creation route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
  );
  
  // Delete post route for review deletion
  
  router.delete(
    "/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.destroyReview)
  );

  module.exports=router;