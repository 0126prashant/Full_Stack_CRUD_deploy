const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name :String,
email :String,
pass :String,
city :String,
age :Number,
role:{type:String,enum:["Admin","Explorer"]}
})

const UserModel =  mongoose.model("users",userSchema)

module.exports = {
    UserModel
}