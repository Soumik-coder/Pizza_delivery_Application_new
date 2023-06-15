const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"]
    },
    email: {
        type: String,
        required: [true,"Name is required"]
        
    },
    password: {
        type: String,
        required: [true,"Name is required"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{timeStamp:true})
const User = mongoose.model("User",userSchema);
module.exports = User;
