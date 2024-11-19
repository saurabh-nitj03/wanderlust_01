const listing =require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

 module.exports.new=(req, res) => {
    // res.send("add request working");
    // console.log(req.user);
  
    res.render("listings/add.ejs");
  } 

  module.exports.showRoute=async (req, res) => {
    let { id } = req.params;
    let listingData = await listing.findById(id)
    .populate({ 
      path: "reviews",
        populate :{
          path:"author",
        },
       })
       .populate("owner");
    if (!listingData) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
    }
    // console.log(listingData);
    res.render("listings/show.ejs", { listingData });
  }

  module.exports.createListing=async (req, res, next) => {
    //    let result= listingSchema.validate(req.body);
    //    console.log(result);
    //    if(result.error){
    //     throw new ExpressError(400,result.error);
    //    }
    
   let response= await geoCodingClient.forwardGeocode({
      query: req.body.location,
      limit: 1
    })
      .send();
      // console.log(response.body.features[0].geometry.coordinates);
      // res.send("done");
      
       
    let url=req.file.path;
    let filename=req.file.filename;
    let { title, image, description, price, location, country } = req.body;
    let owner= req.user._id;
    await listing.create({
      title,
     image: {url,filename},
      description,
      price,
      location,
      country,
      owner,
      geometry:response.body.features[0].geometry,
    });
    req.flash("success", "New Listing added ");
    res.redirect("/listings");
  }
  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listingData = await listing.findById(id);
    if (!listingData) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    }
    let originalUrl=listingData.image.url;
      originalUrl=originalUrl.replace("/upload","/upload/w_300");
    res.render("listings/edit.ejs", { listingData,originalUrl });
  }
  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;
    //   if(!title||!description||!price||!location||!country){
    //     throw new ExpressError(400,"send some valid data for listing");
    // }
  //  let list= await listing.findById(id);
  //  if(currentUser && !list.owner._id.equals(currentUser._id)){
  //    req.flash("error" , "You don't have permission to edit")
  //   return res.redirect(`/listings/${id}`);
  // }
  
  const listingData = await listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
  });
  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listingData.image ={url,filename};
    await listingData.save();
  }
    
      req.flash("success", "Lsiting updated");
     return res.redirect(`/listings/${id}`);
   
  }
  module.exports.destroylisting=async (req, res) => {
    let { id } = req.params;
    // let list = await listing.findById(id);
    // for(r of list.reviews){
    //   await reviews.findByIdAndDelete(r);
    // }
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  }