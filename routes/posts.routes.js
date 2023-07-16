const express = require("express")
const { PostModel } = require("../model/post.model")

const postRouter = express.Router()
const {auth} = require("../middleware/auth.middleware") 
const { ratelimiter } = require("../middleware/ratelimiter.middleware")

postRouter.use(auth)
// postRouter.use(ratelimiter)

postRouter.post("/add",async(req,res)=>{
    const {title,content} = req.body
    // console.log(title,content,name,userId)
    try {
        const post =await PostModel.create({title,content,creatorName:req.name,creatorId:req.userId})
        // const post = new PostModel()
        //     await post.save()
        // console.log(post)
       await post.populate("creatorId")
        res.status(200).send(post)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
postRouter.get("/get",async(req,res)=>{
    const search = req.query.q
    const title =new RegExp(search,"i")
    // console.log(title)
    try {
        if(!title){
            const posts = await PostModel.find({})
            res.status(200).send(posts)
        }
        else{
            const posts = await PostModel.find({title:title})
            res.status(200).send(posts)
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})


postRouter.patch("/update/:id",async(req,res)=>{
    try {
        
        const post = await PostModel.findById(req.params.id);
        console.log(post)
        // console.log(post.creatorId.toString())
        // console.log(req.userId)
        if(post.creatorId.toString() !==req.userId){
            res.status(200).send("Yor are not authorixed for this")
        }
        else{
            const updatedPost = await PostModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
            res.send(updatedPost)
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
postRouter.patch("/like/:id",async(req,res)=>{
    try {
        const post = await PostModel.findById(req.params.id);
        // console.log(post)
        const ind = post.likes.findIndex((ele)=> ele==String(req.userId))
        // console.log(ind)
        if(ind == -1){
            post.likes.push(req.userId)
        }
        else{
            post.likes = post.likes.filter((ele)=> ele !==String(req.userId))
        }
        const postUpdated = await PostModel.findByIdAndUpdate(req.params.id,post,{new:true})
        res.send(postUpdated)
       
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
postRouter.patch("/comment/:id",async(req,res)=>{
    try {
        const post = await PostModel.findById(req.params.id);
        // console.log(post)
        const ind = post.likes.findIndex((ele)=> ele==String(req.userId))
        // console.log(ind)
        if(ind == -1){
            post.likes.push(req.userId)
        }
        const postUpdated = await PostModel.findByIdAndUpdate(req.params.id,post,{new:true})
        res.send(postUpdated)
       
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
postRouter.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    try {
        const Post = await PostModel.findById(id);
        if(Post.creatorId.toString() !== req.userId){
            res.status(200).send("Yor are not authorixed for this")
        }
        else{
            const DeletePost = await PostModel.findByIdAndDelete(id)
            res.send("Post has been Deleted")
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
module.exports = {
    postRouter
}