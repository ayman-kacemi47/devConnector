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
        name: user.name, //  !! req.user has only the id , so we can extract name directly
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

// @route put /api/posts/like/:id
// @DESC like a post
// @Access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post has been alreadty liked
    if (
      post.likes.filter((likes) => likes.user.toString() == req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route put /api/posts/unlike/:id
// @DESC like a post
// @Access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id)
        .length === 0
    ) {
      return res.status(400).send({ msg: ' Post has not been yet liked' });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @ROUTE POST api/posts/comment/:id
// @DESC  add a comment
// @Access private

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array() });
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      console.log('user ', user);
      const comment = {
        user: req.user.id,
        name: user.name,
        text: req.body.text,
        avatar: user.avatar,
      };
      post.comments.unshift(comment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @ROUTER put api/post/comment-remove/:id
// @DESC  add a comment
// @Access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    console.log(comment);

    if (!comment) {
      return res.status(400).send('Comment does not exist');

      //we want that , post owner can delete any comment , and the others can delete only there comments
    } else if (

      comment.user.toString() !== req.user.id
    ) {
      return res.status(400).send('You can not delete others comments');
    }
    const removeIndex = post.comments
      .map((comment) => comment.id)
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
