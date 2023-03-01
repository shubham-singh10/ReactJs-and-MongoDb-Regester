import mongoose from "mongoose";

export const UserSchema= new mongoose.Schema({
    username:{
        type: String,
        require:[true,"Please provide umique Username"],
        unique:[true]
    },
    password:{
        type:String,
        require:[true,"Please provide a password"],
        unique:[true]
    },
    email:{
        type:String,
        require:[true,"Please provide a valid email"],
        unique:[true]
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    mobile:{
        type:Number
    },
    address:{
        type:String
    },
    profile:{
        type:String
    }
})

export default mongoose.model.Users || mongoose.model('User',UserSchema);