 const mongo=require("mongoose");
const reviews = require("./reviews");
const user = require("./user");

 const listingSchema=new mongo.Schema({
    title:{
        type:String,
        required:true,
    },
    image: {
        // type: String,
        // set: function (v) {
        //     // Only set the default image if the provided value is empty or undefined
        //     return v && v.trim() !== "" ? v : this.image;
        // },
        // default: "https://plus.unsplash.com/premium_photo-1664300792059-863ccfe55932?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        url:String,
        filename:String
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
     {
        type:mongo.Schema.Types.ObjectId,
        ref:"reviews"
     }
    ],
    owner:{
        type:mongo.Schema.Types.ObjectId,
        ref:"user"
    },
    // geometry:{
    //       type: {
    //         type: String, // Don't do `{ location: { type: String } }`
    //         enum: ['Point'], // 'location.type' must be 'Point'
    //         required: true
    //       },
    //       coordinates: {
    //         type: [Number],
    //         required: true
    //       }
    //     }
      }

 );

 listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id: {$in: listing.reviews}});
    }
 })
 const listing=new mongo.model("listing",listingSchema);

 module.exports=listing;