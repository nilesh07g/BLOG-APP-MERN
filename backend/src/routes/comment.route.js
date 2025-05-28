const express = require('express');
const Comment = require('../model/comment.model');
const router = express.Router();

//create a comment
router.post('/post-comment',async (req, res) => {
    try {
        console.log(req.body);
        const newComment = new Comment(req.body);
        await newComment.save();
    res.status(200).send({message:"Comment posted successfully",Comment:newComment});
        
    } catch (error) {
        console.error("An error occured while posting a new coment",error);
        res.status(500).send({message:"An error occured while posting a new coment"});
        
    }


});

//get all coments count
router.get("/total-comments",async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments({});
        res.status(200).send({message:"Total comments",totalComments});
        
    } catch (error) {
        console.error("An error occured while getiing comment count ",error);
        res.status(500).send({message:"An error occured while getting count"});
        
    }
});
module.exports = router;