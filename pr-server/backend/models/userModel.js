const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    pic:{
        type:String,
        default:"https://i.pinimg.com/736x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg"
    }
}, {
    timestamps: true
})

const User = mongoose.model("User",userModel)

module.exports = User