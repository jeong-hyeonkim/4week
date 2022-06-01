const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next)=>{
    const {authorization} = req.headers;
    
    const [tokenType, tokenValue] = authorization.split(" ");

    if(tokenType !== "Bearer"){
        res.status(400).send({
            errorMessage:"로그인 후 사용하세요",
        });
        return;
    }
    try{
        const {userId} = jwt.verify(tokenValue,"my-secret-key");

         User.findById(userId).exec().then((user)=>{
            res.locals.uer=user;
            next();
        })
    }catch(err){
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요",
        });
        return;
    }
    
};