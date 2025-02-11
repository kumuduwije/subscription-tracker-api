import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

export const signUp = async (req, res, next) => {

    const session = await  mongoose.startSession();
    session.startTransaction();

    try{

        const {name, email, password} = req.body;

        // check if the user already exists
        const existingUser = await User.findOne({email})

        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
        }

        // Hash the password to store in DB
        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt);

        //Create a new user

        const newUser = await User.create([{name, email, password: hashPassword}], {session});

        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN},)

        await session.commitTransaction();
        await session.endSession();

        res.status(201).json({message: 'User created successfully.', success: true, data:{token, user:newUser[0]}});

    }catch(err){
        await session.abortTransaction();
        await session.endSession();
        next(err)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user,
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut= async (req, res, next) => {

}