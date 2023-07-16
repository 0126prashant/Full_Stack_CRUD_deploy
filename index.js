const express = require("express")

const app = express()
const {connection} = require("./db")
app.use(express.json())
require("dotenv").config()
const { UserModel } = require("./model/userpost.model")

const { userRouter } = require("./routes/register.routes")
const { postRouter } = require("./routes/posts.routes")

// app.get("/home",(req,res)=>{
//     res.send("hello")
// })

// 200: {"msg":"The new user has been registered", "registeredUser":<User details who just registered>}
app.use("/users",userRouter)
app.use("/posts",postRouter)

app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("Connected to db")
    } catch (error) {
        console.log(error)
    }
    console.log(`Port is running at ${process.env.PORT}`)
})