const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const authMiddleWare = async(req,res,next)=>{
if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
    try {
        
        const token = req.headers.authorization.split(" ")[1]

        const checkToken = jwt.verify(token,process.env.JWT_SECRATE)

        req.user = await User.findById(checkToken.id).select("-password")

        next()

    } catch (error) {
        res.status(401)
        throw new Error(error)
    }
}
else{
    res.status(401).send({message:"Please login first"})
}
}

module.exports = authMiddleWare