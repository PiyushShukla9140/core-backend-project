// require(`dotenv`).config({path:"./env"})
import mongoose from "mongoose"
import connectDB from "./db/index.js"
import express from "express"
import dotenv from "dotenv"
import { app } from "./app.js"
import {DB_NAME} from "./constants.js"

dotenv.config({
    path:"./env"
})

// as connectDB() is an async function whoch returns promise
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error!!", err);
  });




// function connectdb(){}

// connnectdb() this can be also used
// but we are going to use IIFE function
// ;(async()=>{
//     try {
//         //console.log("DEBUG URI VALUE:", process.env.MONGODB_URI);
//         const connectdb = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         // isme listeners bhi use hote h
//         app.on("error",()=>{
//             console.log("Error connecting database")
//             throw error
//         })
        
//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("Error connecting database",error)
//         throw error
//     }
// })()