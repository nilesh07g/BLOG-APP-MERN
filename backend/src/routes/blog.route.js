const express = require('express');
const Blog = require('../model/blog.model');
const router = express.Router();
const Comment = require('../model/comment.model');
const verifyToken = require('../middleware/VerifyToken');
const isAdmin = require('../middleware/isAdmin');

//create blog
router.post('/create-post',verifyToken,isAdmin, async (req, res) => {
  try {

      const newPost = new Blog({...req.body,author:req.userId}); 
      await newPost.save();
      res.status(201).send({ message: 'Post created successfully', post: newPost });
  } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send({ message: 'Failed to create post' });
  }
});

//get all blogs
router.get('/', async (req, res) => {
  try {
      const { search, category, location  } = req.query;
      // console.log(search)

      let query = {};

      if (search) {
          query = {
              ...query,
              $or: [
                  { title: { $regex: search, $options: 'i' } },
                  { content: { $regex: search, $options: 'i' } }
              ]
          };
      }

      if (category) {
          query = { ...query, category };
      }
      if (location) {
          query = { ...query, location };
      }
      const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 }); // Adjust populate fields as necessary
      res.status(200).send(posts);
  } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send({ message: 'Failed to fetch posts' });
  }
});

// Get a single post by ID
router.get('/:id',async (req, res) => {
    try {
    //    console.log(req.params.id);
       const postId = req.params.id;
       const post = await Blog.findById(postId);
       if(!post){
        return res.status(404).send({ message: 'Post not found' });
       }
      
       const comment = await Comment.find({postId:postId}).populate('user', 'username email'); //we only show these 2 in comments section
       res.status(200).send({
        message: 'Post fetched successfully',
        post: post,
        
       });

    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send({ message: 'Failed to fetch post' });
    }
});

//update post
router.patch('/update-post/:id',verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body,

            
        },{new: true});

        if (!updatedPost) {
            return res.status(404).send({ message: 'Post not found' });
        }

        res.status(200).send({ message: 'Post updated successfully', post: updatedPost });

        
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send({ message: 'Error updating post' });
        
    }
  
})

//delete a blog
router.delete("/:id", verifyToken,async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        //delete realated comments
        await Comment.deleteMany({postId:postId});

        res.status(200).send({ message: 'Post Deleted successfully', post: post });
        
    } catch (error) {
        console.error('Error Deleting post:', error);
        res.status(500).send({ message: 'Error Deleting post' });

        
    }
});

//related blogs
router.get('/related/:category',async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
        return res.status(400).send({ message: 'Post ID is required' });
        }
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).send({ message: 'Post not found' });
        }
        //give related blogs based on title
        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        const relatedQuery = {
            _id: { $ne: id }, //exlcude the current blog
            title: {$regex:titleRegex}
        }
        const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send({ message: 'Related posts fetched successfully',post: relatedPost });


        
    } catch (error) {
        console.error('Error Fetcheing related posts', error);
        res.status(500).send({ message: 'Error fetching related posts' });

        
    }
    

})

module.exports = router;
