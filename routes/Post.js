const router = require("express").Router();
const mongoose = require('mongoose');

const Post = require("../models/Post");
const User = require("../models/User");
// create post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  console.log(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);


    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully");
    } else {
      res.status(403).json("you cannot update this post ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete post
router.delete("/:id", async (req, res) => {

  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body });
      res.status(200).json("Post is now deleted  successfully");
    } else {
      res.status(403).json("you cannot delete  this post ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like and dislike post a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);


    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked ");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked ");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { updatedAt, ...other } = post._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline  posts
// its include its and friend and followings post
// /timeline/:userId/:page/:limit
router.get("/timeline/:userId", async (req, res) => {
  try {
    const limit = 15, page = (req.query.page || 0);
    const skipIndex = limit * page;

    console.log("page : " + page);
    const currentUser = await User.findById(req.params.userId).select("friends followings");
    // const userPosts = await Post.find({ userId: currentUser._id });

    const allpostUser = [
      ...new Set([...currentUser.friends, ...currentUser.followings, currentUser._id]),
    ].map(function (el) { return mongoose.Types.ObjectId(el) });


    const followingsPosts = await Post.find({ userId: { $in: allpostUser } })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skipIndex)
      .exec()

    // const allPost = userPosts.concat(...followingsPosts);
    console.log("posts length " + followingsPosts.length)
    res.status(200).json(followingsPosts);
  } catch (err) {
    console.log(`Failed to get user with user   ` + err);
    res.status(500).json(err);
  }
});

// get users all post
// do pagenation here /profile/:userId/:page/:limit
// /profile/6210d7967a90b27efc908011&page=1&limit=3.
// skip  page*20 , limit size
// page starting from 0
//find()
// .sort({ _id: 1 })
// .limit(limit)
// .skip(skipIndex)
// .exec();
router.get("/profile/:userId", async (req, res) => {
  try {
    const limit = 15, page = (req.query.page || 0);
    const skipIndex = limit * page;
    const userPosts = await Post.find({ userId: req.params.userId })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skipIndex)
      .exec()

    res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;