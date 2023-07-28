const mongoose=require('mongoose')         //To establish connection to Mongo DB
require('dotenv').config()

//Connecting to our MongoDB via URI
const connectDB=() => {
    console.log("MongoDB Connection Established")

    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports=connectDB