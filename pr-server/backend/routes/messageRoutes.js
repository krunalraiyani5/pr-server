const express = require("express");
const authMiddleWare = require("../middleware/authMiddleware");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const router = express.Router()

// for message endpoint is api/message
router.post("/",authMiddleWare,async(req,res)=>{
    const {chatId,content} =  req.body

    if (!chatId || !content) {
        res.status(400).send({message:"Invalid passed data"})
    }

    let newMassage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try {

        let message = await Message.create(newMassage)
        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        
        res.status(200).json(message)
        
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }

})


// for get chat message endpoint is api/message/:chatId
router.get("/:chatId",authMiddleWare,async(req,res)=>{
    try {
        const message = await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")
        
        res.status(200).json(message)
        
    } catch (error) {
        res.status(400)
        throw new Error(error)
    }

})


module.exports = router;