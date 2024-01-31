const express = require("express")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")
const authMiddleWare = require("../middleware/authMiddleware")

const router = express.Router()

// for cerate or access chat end point is api/chat
router.post("/",authMiddleWare,async(req,res)=>{
    const {userId} = req.body

    if (!userId) {
        res.status(400).send({message:"Something was wrong"})
    }

    let isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {user:{$elemMatch:{$eq:req.user._id}}},
            {user:{$elemMatch:{$eq:req.userId}}},
        ]
    }).populate("uesrs", "-password").populate("latestMessage")

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })

    if (isChat.length > 0) {
        res.status(200).send(isChat)
    }else{

        let newChat = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }


        try {

            const createCaht = await Chat.create(newChat)

            const fullChat = await Chat.findOne({_id:createCaht._id}).populate("users","-password")
            console.log(createCaht)

            res.status(200).send(fullChat)
            
        } catch (error) {
            res.status(400)
            throw new Error(error)
        }

    }

})


// for fetch chat end point is api/chat
router.get("/",authMiddleWare,async(req,res)=>{
    
   try {
    let userChat = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate("users", "-password")
    .populate("groupAdmin","-password")
    .populate("latestMessage")
    .sort({updateAt:-1})

    userChat = await User.populate(userChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })

    res.status(200).send(userChat)
   } catch (error) {
    res.status(400)
    throw new Error(error)
   }

})


// for create group end point is api/chat/group
router.post("/group",authMiddleWare,async(req,res)=>{

    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message:"Please fill all the members"})
    }
    
    let users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send({message:"More then 2 users required for the group chat"})
    }

    users.push(req.user)

   try {
    let groupChat = await Chat.create({
        chatName:req.body.name,
        users:users,
        isGroupChat:true,
        groupAdmin:req.user
    })

    const fullGroupChat = await Chat.findOne({_id:groupChat._id})
    .populate("users", "-password")
    .populate("groupAdmin","-password")

    res.status(200).json(fullGroupChat)
   } catch (error) {
    res.status(400)
    throw new Error(error)
   }

})


// for rename group end point is api/chat/rename
router.put("/rename",authMiddleWare,async(req,res)=>{

    const {chatId,chatName} = req.body

    const updateChat = await Chat.findByIdAndUpdate(chatId,{chatName},{new:true})
    .populate("users", "-password")
    .populate("groupAdmin","-password")

    if (updateChat) {
        res.status(200).json(updateChat)
    }else{
        res.status(400).send({message:"Chat not fount"})
        
    }

})

// for add people in group end point is api/chat/groupadd
router.put("/groupadd",authMiddleWare,async(req,res)=>{

    const {chatId,userId} = req.body

    const add = await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true})
    .populate("users", "-password")
    .populate("groupAdmin","-password")

    if (add) {
        res.status(200).json(add)
    }else{
        res.status(400).send({message:"Something was wrong"})
        
    }

})

// // for remove from group group end point is api/chat/groupremove
router.put("/groupremove",authMiddleWare,async(req,res)=>{

    const {chatId,userId} = req.body

    const remove = await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true})
    .populate("users", "-password")
    .populate("groupAdmin","-password")

    if (remove) {
        res.status(200).json(remove)
    }else{
        res.status(400).send({message:"Something was wrong"})
        
    }

})


module.exports = router