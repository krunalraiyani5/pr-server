const express = require("express")
const User = require("../models/userModel")
const generateToken = require("../config/generateToken")
const bcrypt = require("bcryptjs")
const checkPassword = require("../middleware/checkPassword")
const authMiddleWare = require("../middleware/authMiddleware")

const router = express.Router()

// for register endpoint is /api/user/register

router.post("/register",async(req,res)=>{

    try {
        let {name,email,password,pic} = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all fields")
    }

    const userExsist = await User.findOne({email})

    if (userExsist) {
        res.send(400)
        throw new Error("User is alrady exsist")
    }

    const salt = await bcrypt.genSalt(10)
    const genPassword = await bcrypt.hash(password,salt)

    const user = await User.create({ name, email, password:genPassword, pic })


    if (user) {
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)

        })
    }else{
        res.status(400)
        throw new Error("Fail to register")
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})


// for login endpoint is /api/user/login

router.post("/login",checkPassword,async(req,res)=>{
    try {
        const {email,password} = req.body

    const user = await User.findOne({email})

    if (user) {
        res.status(200).json({
            data:{
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            },
            message:"Login successfully"
        })
    }
    else{
        res.send(400)
        throw new Error("Invalid Email or Password")
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})


// for login endpoint is /api/user?search=naem

router.get("/",authMiddleWare,async(req,res)=>{
    
    const keyword = req.query.search?
    {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{}

    const user = await User.find(keyword).find({_id:{$ne:req.user._id}})

    res.status(200).send(user)

})

module.exports = router;