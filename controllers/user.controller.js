import User from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
    try{
        const user = await User.find();
        res.status(200).json({success: true, data: user});

    }catch (err){
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id).select("-password");
        res.status(200).json({success: true, data: user});

        if(!user){
            const error = new Error('User not found');
            error.status = 404;
        }


        res.status(200).json({success: true, data: user});

    }catch (err){
        next(err);
    }
}


