const router = require('express').Router();
const Message = require('../models/Message');
const isAuth = require("../Middleware/auth");
const Conversation = require('../models/Conversation');
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

		const loginUserId = req.user.id;
		const conversation = await Conversation.find({
			members: { $in: [loginUserId] },
			_id: req.params.conversationId
			// it return all the conversation in which this userID present
		});


		if (!conversation || conversation.length == 0) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid Credentials" }] });
		}
		else {
			const days = req.query.days;
			const messages = await Message.find({
				conversationId: req.params.conversationId,
			}).sort({ _id: -1 }).limit(days * 300);

			res.status(200).json(messages.reverse());
		}

	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
