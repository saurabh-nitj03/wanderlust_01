const express = require("express");
const router = express.Router();

const listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { populate } = require("../models/reviews.js");

const listingController= require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");

const upload =  multer({ storage })
router.route("/")
       .get(wrapAsync(listingController.index))
       .post(
        isLoggedIn,
        upload.single('image'),
        validateListing,
        wrapAsync(listingController.createListing))
      // .post(upload.single('image'),(req,res)=>{
      //   res.send(req.file);
      // });
// index route
// router.get("/",wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.new);

router.route("/:id")
      .get(wrapAsync(listingController.showRoute) )
      .put(
        isLoggedIn,
        isOwner,
        upload.single('image'),
        validateListing,
        wrapAsync(listingController.updateListing))
      //  (req,res)=>{ res.send("put request working")})

//   show route foer individual listings

router.get(
  "/:id",
  wrapAsync(listingController.showRoute)
);

//  post route-> new listing route
router.post(
  "/",isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

//  edit route for form fillup

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
//   put route to edit a listing
router.put(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// delete route to delete a lsitings
router.delete(
  "/:id/del",isLoggedIn,isOwner,
  wrapAsync(listingController.destroylisting)
);

module.exports = router;
