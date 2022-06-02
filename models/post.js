const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    comments:[{
        body:{type:String,required:true,},
        writerId:{type:String,required:true,},
        createdAt:{type:Date, default:Date.now},
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        Date
    },
    password:{
        type:String,
        required:true,
    },
    
});

module.exports = mongoose.model("Post",PostSchema);