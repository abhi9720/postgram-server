const router = require('express').Router();
const Message = require('../models/Message');
const isAuth = require("../Middleware/auth");
// add message
router.post('/', isAuth, async (req, res) => {
	const newMessage = new Message(req.body);
	try {
		const saveMessage = await newMessage.save();
		res.status(200).json(saveMessage);
	} catch (err) {
		res.status(500).json();
	}
});

// get message
router.get('/:conversationId', isAuth, async (req, res) => {
	try {
		const messages = await Message.find({
			conversationId: req.params.conversationId,
		});
		res.status(200).json(messages);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
