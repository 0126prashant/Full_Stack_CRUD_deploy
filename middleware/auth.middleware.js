const jwt = require("jsonwebtoken")
const { BlacklistModel } = require("../model/blacklist.model")

const auth = async(req,res,next)=>{
    try {
        const token =  req.headers.authorization?.split(" ")[1]
        if(token){
            // const newToken = await BlacklistModel.find({blacklistedtokens:{$in:token}  })
           let newToken= BlacklistModel.filter((ele)=>{
                //    console.log(ele)
                   ele == token
            })
            console.log(newToken)
            if(newToken.length>0){
                res.status(400).send({error:"login again"})
            }

            var decoded = jwt.verify(token, 'masai'); 
            // console.log(decoded)
            req.userId = decoded.userId;
            req.name = decoded.name
            next()
            // var decoded = jwt.verify(token, 'shhhhh'); 
        }
        else{
            res.status(400).send({error:"Login first"})
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }
}

module.exports = {
    auth
}


