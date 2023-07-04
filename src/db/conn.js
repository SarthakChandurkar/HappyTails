const mongoose = require("mongoose");

const MONGODB_URI = process.env.ATLAS_URI

mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/loyalRegisteration",
{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{
    console.log("connected to db");
}).catch(()=>{
    console.log("db not connected");
})


