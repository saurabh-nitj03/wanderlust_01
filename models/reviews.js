const mongo=require("mongoose");
// const {Schema} = mongo.Schema;

const reviewSchema=new mongo.Schema({
    comment:String,
    rating:{
        type:Number,
        min:0,
        max:5, 
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongo.Schema.Types.ObjectId,
        ref:"user",
    }, 

});

module.exports=mongo.model("reviews",reviewSchema);