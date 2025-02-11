import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error('MongoDB URI not defined in the  .env.<development/production>.local');
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);

        console.log(`MongoDB Connected successfully in ${NODE_ENV} mode.`);
    }catch (error){
        console.error(error)
        process.exit(1);
    }
}

export default connectToDatabase;