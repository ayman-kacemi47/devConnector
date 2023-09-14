const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route POST api/posts
// @desc    add a POST
// @access Private

router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        user: user.id, // he used req.user.id , but it should be req.id from token or user.id that we fetched
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        date: req.body.date, //not necessery
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/posts
// @desc    GET all POSTs
// @access Public
router.get('/', async (req, res) => {
  try {
    const AllPosts = await Post.find().sort({ date: -1 }); // find all post , with sort -1 => recent first
    res.json(AllPosts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/posts/:id
// @desc    GET Post by id
// @access private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //avoid null error , by verifying that post exist
    if (!post) return res.status(400).send('Post not found');

    res.json(post);
  } catch (err) {
    if (err.kind == 'ObjectId') return res.status(400).send('Post not found');
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE api/posts/:post_id
// @desc   delete post by Id
// @access private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //avoid null error , by verifying that post exist
    if (!post) return res.status(400).send('Post not found');

    //check user to delete post is the owner
    if (post.user.toString() !== req.user.id)
      //post.user is a object so we should change type to match
      return res.status(401).send('Not authorized to delete this post');

    await post.deleteOne(); // post.remove()  maybe not supported in mongoose last versions
    res.send({ msg: 'Post removed' });
  } catch (err) {
    if (err.kind == 'ObjectId')
      return res.status(400).send('Post to delete not found');
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
