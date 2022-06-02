const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const authMiddleware = require("./middlewares/auth-middleware");
const router = express.Router();

//댓글 목록 
router.get('/posts/:postId/comments',async(req,res)=> {
    const { postId } = req.params;
    const post = await Post.findOne({ postId });
 
    await User.populate(post.comments, {
        path: 'author'
    });
 
    res.json(post.comments);
});

//댓글 작성 
router.post("/posts",authMiddleware,async(req,res)=>{
    const{name,author,comments,password} = req.body;

    const user = res.locals.user;
    if(!user){
        res.status(400).send({
            errorMessage: "로그인이 필요한 기능입니다.",
        });
        return;
    }
    console.log(user);

     const createPost = await Post.create({name,author,comments,password});
     if(createPost("")){
         res.status(400).send({
             errorMessage:"댓글 내용을 입력해주세요.",
         });
         return;
     }
     await createPost.save();
    res.send({result: "댓글을 작성하였습니다.",
});
});

//댓글 수정 
router.put("/posts/:postId",authMiddleware,async(req,res)=>{
    const {postId} = req.params;
    const {comments,password} = req.body;

    const existPost = await Post.findOne({postId, password});
    if(!existPost||!postId){
        res.status(400).send({errorMessage:"작성자와 일치하지 않습니다.",
    });
    return;
    }
     await Post.updateOne({postId}, {$set: {comments, password}});
        res.send({result: "댓글을 수정하였습니다."});
});

//댓글 삭제 
router.delete("/posts/:postId",authMiddleware,async(req,res)=>{
    const { postId } = req.params;
    const { password, author } = req.body;
    
    const existPost = await Post.find({postId,password,author})

    if(!existPost||!author){
        res.status(400).send({errorMessage:"작성자와 일치하지 않습니다.",
    });
    return;
    }
    await existPost.deleteOne({postId});
    res.send({result:"게시글을 삭제하였습니다."})
});

module.exports = router;