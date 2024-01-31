const mongoose = require("mongoose")

const mongoURI = "mongodb://127.0.0.1:27017/chat_db"

const connectDb = async()=> {
    try {
        const connect = await mongoose.connect(mongoURI)
        console.log("database is connected")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectDb