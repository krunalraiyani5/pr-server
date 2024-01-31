const express = require('express')
const connectDb = require('./config/db')
const dotenv = require("dotenv")
const cors = require('cors');



const app = express()

app.use(cors());
dotenv.config()
connectDb()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({message:'Welcome to the demo app'})
})

app.use('/api/user', require("./routes/userRoutes"))
app.use('/api/chat', require("./routes/chatRoutes"))
app.use('/api/message', require("./routes/messageRoutes"))

app.listen("8000",console.log("server is start"))