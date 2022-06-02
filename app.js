const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const authMiddleware = require("./middlewares/auth-middleware");

mongoose.connect("mongodb://localhost/4week", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

router.post("/users", async(req,res)=>{
  const {nickname, email, password, confirmPassword} = req.body;

   const testPassword = password.search(nickname) > -1;
   if(!testPassword.test(password)){
       alert("비밀번호에 닉네임이 포함되어 있습니다.")
   }else if( !password ===/^[a-zA-Z0-9_-]{,4}$/){
    alert("한글, 영문(대/소), 숫자포함 최소4자리 이상으로 입력해주세요.")
   }
  if(password !== confirmPassword){
      res.status(400).send({ errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return; 
      }

      const existUsers = await User.find({
          $or:[{nickname}],
      });
      const testNickname =  /^[a-zA-Z0-9_-]{3,12}$/;
        if (!testNickname.test(nickname)) { 
            setNicknameMessage('한글, 영문(대/소), 숫자 포함 3-12자리 내로 입력해주세요.');
        } else {
            setNicknameMessage('');
        }
      if(existUsers.length){
          res.status(400).send({
              errorMessage:"중복된 닉네임이 있습니다.",
          });
          return;
      }  
      const user = new User({email, nickname, password}); 
      await user.save();  //회원가입 정보 저장
      res.status(201).send({});
});

router.post("/auth", async(req,res)=>{
    const {nickname,password} = req.body;

    const user = await User.findOne({nickname ,password}).exec();

    if(!user){
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드가 잘못됐습니다.",
        });
        return;
    }
    const token = jwt.sign({userId:user.userId},"my-secret-key");
    res.send({
        token,
    });
});

router.get("/users/me",authMiddleware ,async(req,res)=>{
    const {user} = res.locals;
    res.send({
        user,
    });
});


app.use("/api", express.urlencoded({ extended: false }), router);


app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});