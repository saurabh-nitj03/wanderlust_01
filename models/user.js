const mongo=require("mongoose");
const schema=mongo.Schema;
const pass=require("passport-local-mongoose");

const userSchema= new schema ({
      email:{
        type:String,
        required:true
      }
    //   username ,salting , hashed password will get automatically be added by package
    // after plugin  
});
userSchema.plugin(pass);
module.exports= mongo.model("user",userSchema); 