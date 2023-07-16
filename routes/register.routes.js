const express = require("express")
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const { UserModel } = require("../model/userpost.model")
const jwt = require("jsonwebtoken")
const {BlacklistModel} = require("../model/blacklist.model")

userRouter.post("/register",async(req,res)=>{
    
    const {email,pass} = req.body
    const userExist = await UserModel.find({email})
    try {
        if(userExist.length){
           res.status(400).send({error : "user Already prresent"}) 
        }
        if(checkPass(pass)){
            const hash = bcrypt.hashSync(pass, 7)
            const user = new UserModel({...req.body,pass:hash})
            await user.save()
            // console.log(user)
            res.status(200).send({msg:"The new user has been registered",registeredUser:user})

        }
      res.status(400).send({error : "Check the password"}) 
    } catch (error) {
        res.status(400).send({error:error.message})
    }

})


userRouter.post("/login",async(req,res)=>{
   const {email,pass} = req.body
   try {
    const userExist = await UserModel.findOne({email})
    // console.log(userExist._id.toString())
    if(userExist){
        bcrypt.compare(pass, userExist.pass,(err, result)=> {
            // result == true
            if(err){
                res.status(400).send({err:err.message})
            }
            var token = jwt.sign({ userId:userExist.id,name:userExist.name }, "masai");
            if(token){
                res.status(200).send({msg:"Login successful!","token":token,name:userExist.name, userId:userExist.id})
            }
        });
        
    }
   } catch (error) {
    res.status(400).send({error:error.message})
   }

})

  
userRouter.get("/logout",async(req,res)=>{
    const token =  req.headers.authorization?.split(" ")[1] || null
     try {
        if(token){
        //  await BlacklistModel.updateMany({},{$addToSet:{blacklistedtokens:[token]}});
        await BlacklistModel.push(token)
            // 200: {"msg":"User has been logged out"}
        
            res.status(200).send({msg:"User has been logged out"})
            console.log(BlacklistModel)
        }
     } catch (error) {
        res.status(400).send({error:error.message})
     }
})


module.exports ={
    userRouter
}

// => At least one uppercase character
// => At least one number
// => At least a special character
// => The length of password should be at least 8 characters long
// If a user already exist, a new user with same email cannot register, send appropriate response in this case.
function checkPass(pass){
   if(pass.length<8){
      return false
   }
   let alp ="abcdefghijklmnopqrstuvwxyz"
   let num = "0123456789"
   let spc = "!@#$%^&*(){}[]=-/`~_"

   let flag1 = false
   let flag2 = false
   let flag3 = false

   for(let i=0;i<pass.length;i++){
    if(alp.includes(pass[i])){
        flag1 =true
    }
    if(num.includes(pass[i])){
        flag2 =true
    }
    if(spc.includes(pass[i])){
        flag3 =true
    }
   }
   return flag1 && flag2 && flag3 ? true :false
}
// console.log(checkPass("hello@12344"))