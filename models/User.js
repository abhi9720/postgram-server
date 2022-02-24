const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			min: 3,
			max: 20,
			unique: true,
		},
		email: {
			type: String,
			max: 50,
			require: true,
			unique: true,
		},
		password: {
			type: String,
			require: true,
			min: 6,
		},
		profilePicture: {
			type: String,
			default: '',
		},
		coverpicture: {
			type: String,
			default: '',
		},
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		friends: {
			type: Array,
			default: [],
		},
		pendingRequest: {
			type: Array,
			default: [],
		},
		friendrequest: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		description: {
			type: String,
			max: 50,
		},
		city: {
			type: String,
			max: 50,
			default: 'N/A',
		},
		from: {
			type: String,
			max: 50,
			default: 'N/A',
		},
		relationships: {
			type: Number,
			enum: [1, 2, 3],
			default: 3,
		},
	},

	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
