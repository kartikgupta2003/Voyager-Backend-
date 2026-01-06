const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    clerkId : {
        type : String ,
        required : true,
        unique:true
    } ,
    name : {
        type : String ,
        required : true,
    } ,
    email : {
        type : String ,
        required : true ,
        unique : true ,
    } ,
    pic : {
        type : String 
    }  , 
    trips : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "Trip",
        }
    ]

} , {timestamps : true});

const User = mongoose.model("User" , userSchema);

module.exports = User ;