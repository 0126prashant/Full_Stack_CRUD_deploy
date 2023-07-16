const mongoose = require("mongoose")


const postSchema = mongoose.Schema({
    title :String,
    content :String,
    // creatorName:String,
    creatorName:String,
    creatorId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    likes:{type:[String],default:[]},
    comments:{type:[String],default:[]},
    tags:[String]

})

const PostModel =  mongoose.model("post",postSchema)

module.exports = {
    PostModel
}