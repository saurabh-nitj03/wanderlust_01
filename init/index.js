const mongo=require("mongoose");
const listing=require("../models/listing.js")
const reviews=require("../models/reviews.js")
const initdata=require("./data.js")

async function main(){
    mongo.connect('mongodb://127.0.0.1:27017/wanderlust')
}
main().then((res)=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log(err);
})

async function initDB(){
   await listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj, owner:'6735b127caef90c7e62084f9'}));
   await listing.insertMany(initdata.data);
   console.log("Sample data added ");
}
initDB(); 