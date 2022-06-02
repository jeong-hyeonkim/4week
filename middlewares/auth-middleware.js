const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next)=>{
    const {authorization} = req.headers;
    
    const [tokenType, tokenValue] = authorization.split(" ");

    if(tokenType !== "Bearer"){
        res.status(401).send({
            errorMessage:"로그인이 필요합니다",
        });
        return;
    }
    try{
        const {userId} = jwt.verify(tokenValue,"my-secret-key");

         User.findById(userId).then((user)=>{
            res.locals.user=user;
            next();
        })
    }catch(err){
        res.status(401).send({
            errorMessage: "로그인이 필요합니다",
        });
        return;
    }
    
};