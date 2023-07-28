require('dotenv').config()                 //The .evn file is now accessible to the server.js file
const express=require('express')
const movieroutes=require('./Routes/Routes')
//const mongoose=require('mongoose')       //To establish connection to Mongo DB
const connectDB=require('./Database/Connect')

//Creating an Express App
const app=express()

//Make use of Middleware
app.use(express.json())                    //To Handle Requests (Checks for data in the request and then passes to the 'res' object)


app.use((req,res,next)=>
{
    console.log(res.path, req.method)      //Logs all requests (can be seen in the terminal)
    next()                                 //next will make the link to run the next middleware (You can make Chains)
})


//Routes aka Handler
app.use('/api/Movie',movieroutes)         //We established a link based on the corresponding '/' present in Routes.js 

//Listen for Requests at PORT as well as connection to MongoDB
connectDB().then(() =>                    //Function call to Connect.js to Establish Connection to MongoDB
    {
        app.listen(process.env.PORT, () => 
        {
            console.log("Backend Server at PORT:",process.env.PORT)
        })
    })
    .catch((error) =>
    {
        console.log(error)
    })
