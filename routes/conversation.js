const router = require("express").Router();
const Conversation = require("../models/Conversation");
const isAuth = require("../Middleware/auth");

//new conversation
router.post("/", isAuth, async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get conv of a user
router.get("/:userId", isAuth, async (req, res) => {
  try {

    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      // it return all the conversation in which thi userID present
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", isAuth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete Conversation 
router.delete("/delete/:firstUserId/:secondUserId", isAuth, async (req, res) => {
  try {
    const resdel = await Conversation.findOneAndDelete({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });

    return res.status(200).json(resdel);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: err,
      message: "Conversation not found ",
    });
  }
});

module.exports = router;
