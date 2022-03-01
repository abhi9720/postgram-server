const router = require("express").Router();
const User = require("../models/User");
const isAuth = require("../Middleware/auth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const mongoose = require('mongoose');



// update user
// router.put("/:id", async (req, res, next) => {
//   if (req.body._id === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }

//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       console.log(`failed to update ${err} ----------------- `);
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account ");
//   }
// });

//update profile photo
router.put(
  "/:id/updateprofilepicture",
  isAuth,
  upload.single("file"),
  async (req, res, next) => {



    if (String(req.user.id).localeCompare(String(req.params.id)) === 0) {
      const userFound = await User.findById(req.params.id);
      userFound.profilePicture = req.file.path;
      await userFound.save();
      res.status(200).json(userFound);
    }
    else {
      res.status(401).json({ message: "User is not authorized" })
    }
  }
);

//update cover photo
router.put(
  "/:id/updatecoverpicture",
  isAuth,
  upload.single("file"),
  async (req, res, next) => {

    if (String(req.user.id).localeCompare(String(req.params.id)) === 0) {
      const userFound = await User.findById(req.params.id);
      userFound.coverpicture = req.file.path;
      await userFound.save();
      res.status(200).json(userFound);
    }
    else {
      res.status(401).json({ message: "User is not authorized" })
    }
  }
);

// delete user
router.delete("/:id", isAuth, async (req, res, next) => {
  if (String(req.user.id).localeCompare(String(req.params.id)) === 0) {
    try {
      await User.findOneAndDelete(req.params.id);
      res.status(200).json("Account has been deleted successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You cannot delete  only your account ");
  }
});

// get a user
router.get("/", isAuth, async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId).select("-password")
      : await User.findOne({ username: username }).select("-password");
    const { password, updatedAt, ...other } = user?._doc;

    return res.status(200).json(other);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


// get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("username profilePicture");

    // let userList = [];
    // users.map((friend) => {
    //   const { _id, username, profilePicture } = friend;
    //   userList.push({ _id, username, profilePicture });
    // });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get friends
// use populate command 
router.get("/followers/:userId", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId).select("username profilePicture")
      })
    );


    res.status(200).json(friends);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put("/:id/follow", isAuth, async (req, res) => {
  if (req.body.userId != req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        const updateduser = await User.findById(req.params.id);
        res.status(200).json(updateduser);
      } else {
        res.status(403).json("Already follow this user ");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Failed to follow user ");
    }
  } else {
    res.status(403).json("you cannot follow urself");
  }
});

// unfollow a user
router.put("/:id/unfollow", isAuth, async (req, res) => {
  if (String(req.user.id).localeCompare(String(req.params.id)) !== 0) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        const updateduser = await User.findById(req.params.id);
        res.status(200).json(updateduser);
      } else {
        res.status(403).json("not follwing follow this user ");
      }
    } catch (err) {
      res.status(500).json("Failed to unfollow user ");
    }
  } else {
    res.status(403).json("you cannot follow urself");
  }
});

// send request to add new friend
router.put("/:id/addNewFriends", isAuth, async (req, res) => {
  if (String(req.user.id).localeCompare(String(req.params.id)) !== 0) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.friends.includes(currentUser._id)) {
        await user.updateOne({ $push: { friendrequest: req.body.userId } });
        await currentUser.updateOne({
          $push: { pendingRequest: req.params.id },
        });
        res
          .status(200)
          .json("user has been  Added in friendslist successfully");
      } else {
        res.status(403).json("Already in friends list this user ");
      }
    } catch (err) { }
  } else {
    res.status(403).json("you cannot follow urself");
  }
});

// reject friend request
router.put("/:id/rejectrequest", isAuth, async (req, res) => {
  if (String(req.user.id).localeCompare(String(req.params.id)) !== 0) {
    try {
      const user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.body.userId);

      if (user.pendingRequest.includes(currentUser._id)) {
        await user.updateOne({ $pull: { pendingRequest: req.body.userId } });
        await currentUser.updateOne({
          $pull: { friendrequest: req.params.id },
        });

        currentUser = await User.findByIdAndUpdate(
          req.body.userId,
          { $pull: { friends: req.params.id } },
          {
            new: true,
          }
        );

        res.status(200).json(currentUser);
      } else {
        res.status(403).json("Access denied ");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(403).json("you canot to friend request to urself ");
  }
});

//accept friends request
router.put("/:id/acceptFriendRequest", isAuth, async (req, res) => {
  // here user is id of that user who send request
  // and  currentuser is whi got friend request(will accept or reject )
  if (String(req.user.id).localeCompare(String(req.params.id)) !== 0) {
    try {
      const user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.body.userId);

      if (user.pendingRequest.includes(currentUser._id)) {
        await user.updateOne({ $pull: { pendingRequest: req.body.userId } });
        await currentUser.updateOne({
          $pull: { friendrequest: req.params.id },
        });

        await user.updateOne({ $push: { friends: req.body.userId } });
        currentUser = await User.findByIdAndUpdate(
          req.body.userId,
          { $push: { friends: req.params.id } },
          {
            new: true,
          }
        );

        res.status(200).json(currentUser);
      } else {
        res.status(403).json("Already in friends list this user ");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(403).json("you cannot follow urself");
  }
});

// unfriends user
router.put("/:id/unfriend", isAuth, async (req, res) => {
  if (String(req.user.id).localeCompare(String(req.params.id)) !== 0) {
    try {
      const user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.body.userId);

      if (user.friends.includes(currentUser._id)) {
        // await user.updateOne({ $pull: { pendingRequest: req.body.userId } });
        // await currentUser.updateOne({ $pull: { friendrequest: req.params.id } });

        await user.updateOne({ $pull: { friends: req.body.userId } });
        currentUser = await User.findByIdAndUpdate(
          req.body.userId,
          { $pull: { friends: req.params.id } },
          {
            new: true,
          }
        );

        res.status(200).json(currentUser);
      } else {
        res.status(403).json("you need to be friends before unfriend");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(403).json("you cannot follow urself");
  }
});


// friend suggestion
router.get('/connection/suggestion', isAuth, async (req, res) => {
  console.log("suggestion ")

  // we need current login user here 
  // so we can pick those samples for which this user is not friend and not following
  // using  $nin operator find all user in which this user._id not present in friend .
  const loginuserconnection = await User.findById(req?.user.id).select('friends') || [];
  const avoid = [...loginuserconnection?.friends, req?.user.id]

  const ids = avoid.map(function (el) { return mongoose.Types.ObjectId(el) })
  const suggestion = await User.aggregate([

    {
      $match: {
        _id: { $nin: ids }
      }
    },
    { $sample: { size: 5 } },
    { $project: { "_id": "$_id", "profilePicture": "$profilePicture", "username": "$username" } }
  ])

  return res.status(200).json(suggestion)
})

module.exports = router;
