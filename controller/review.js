const reviews=require("../models/reviews.js")
const listing=require("../models/listing.js")

module.exports.createReview=async (req, res) => {
    let { id } = req.params;
    let listingData = await listing.findById(id);
    let rev = req.body.reviews;
    let newReview = new reviews(rev);
    newReview.author = req.user._id; 
    await newReview.save();
    listingData.reviews.push(newReview);
    await listingData.save();
    // console.log("new review saved");
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    // pull operator is used to modify database of existing content
    // pull operator justs pull that id from rveiews array of  listings
    await listing.findByIdAndUpdate(id, {
      $pull: {
        reviews: reviewId,
      },
    });
    await reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
  }