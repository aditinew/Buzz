const express = require("express");
const { User } = require("../models/user");
const admin = require("../config/firebase-config");
const {
	validateRegister,
	validateGoogleRegister,
} = require("../services/validation");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { Post } = require("../models/post");
const router = express.Router();

// Get data of current user
router.get("/profile", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
});

// Get data of all users
router.get("/users", auth, async (req, res) => {
	const users = await User.find({
		_id: { $ne: req.user._id },
		friends: { $nin: [req.user.uid] },
	}).select("_id email firstName lastName profileImage");
	res.send(users);
});

// Get data of of particular user using its id
router.get("/:id/profile", auth, async (req, res) => {
	const user = await User.findById(req.params.id).select("-password");
	res.send(user);
});

// Update the profile of current user
router.post("/:id/userprofile", async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.designation = req.body.designation;
		user.website = req.body.website;
		user.gender = req.body.gender;
		user.dateOfBirth = req.body.dateOfBirth;
		user.city = req.body.city;
		user.state = req.body.state;
		user.pincode = req.body.pincode;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			designation: updatedUser.designation,
			website: updatedUser.website,
			gender: updatedUser.gender,
			dateOfBirth: updatedUser.dateOfBirth,
			city: updatedUser.city,
			state: updatedUser.state,
			pincode: updatedUser.pincode,
			profileImage: user.profileImage,
			coverImage: user.coverImage,
		});
	} else {
		res.status(404);
		throw new Error("User not found !");
	}
});

// Update the profile image of current user
router.post("/:id/profileImage", async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.profileImage = req.body.profileImage;

		const updatedUser = await user.save();

		res.json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			designation: user.designation,
			website: user.website,
			gender: user.gender,
			dateOfBirth: user.dateOfBirth,
			city: user.city,
			state: user.state,
			pincode: user.pincode,
			profileImage: updatedUser.profileImage,
		});
	} else {
		res.status(404);
		throw new Error("User not found !");
	}
});

// Update the cover image of current user
router.post("/:id/coverImage", async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.coverImage = req.body.coverImage;

		const updatedUser = await user.save();

		res.json({
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			designation: user.designation,
			website: user.website,
			gender: user.gender,
			dateOfBirth: user.dateOfBirth,
			city: user.city,
			state: user.state,
			pincode: user.pincode,
			profileImage: user.profileImage,
			coverImage: updatedUser.coverImage,
		});
	} else {
		res.status(404);
		throw new Error("User not found !");
	}
});

// Add the views of the user
router.put("/:id/addViews", auth, async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.profileViews = user.profileViews + 1;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			profileViews: updatedUser.profileViews,
		});
	} else {
		res.status(404);
		throw new Error("User not found !");
	}
});

// Sent friend request to a user
router.put("/:id/sendFriendRequest", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.friendRequestsSent.includes(req.body.userId)) {
				await user.updateOne({
					$push: { friendRequestsReceived: req.body.userId },
				});
				await currentUser.updateOne({
					$push: { friendRequestsSent: req.params.id },
				});
				res.status(200).send("the request has been sent");
			} else {
				res.status(403).send(
					"you already sent the request to this user"
				);
			}
		} catch (err) {
			res.status(500).send("Error", err);
		}
	} else {
		res.status(403).send("you cant send request");
	}
});

// Accept friend request of a user
router.put("/:id/acceptFriendRequest", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.friendRequestsSent.includes(req.body.userId)) {
				await currentUser.updateOne({
					$push: { friends: req.params.id },
					$pull: { friendRequestsReceived: req.params.id },
				});
				await user.updateOne({
					$push: { friends: req.body.userId },
					$pull: { friendRequestsSent: req.body.userId },
				});
				res.status(200).send("the request has been accepted");
			} else {
				res.status(403).send(
					"you dont have any request from this user"
				);
			}
		} catch (err) {
			res.status(500).send("Error", err);
		}
	} else {
		res.status(403).send("you cant accept request");
	}
});

// Reject friend request of a user
router.put("/:id/friendRequestDelete", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.friendRequestsSent.includes(req.body.userId)) {
				await currentUser.updateOne({
					$pull: { friendRequestsSent: req.body.userId },
				});
				await user.updateOne({
					$pull: { friendRequestsReceived: req.params.id },
				});
				res.status(200).send("the request has been deleted");
			} else {
				res.status(403).send(
					"you already deleted the request to this user"
				);
			}
		} catch (err) {
			res.status(500).send("Error", err);
		}
	} else {
		res.status(403).send("you cant delete friend request");
	}
});

// Register and Login of user using google
router.post("/register/google", async (req, res) => {
	const { error } = validateGoogleRegister(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// let re = /[a-z0-9]+@tothenew.com/;

	// if (!re.test(req.body.email)) {
	// 	return res.status(403).send("Email is not valid");
	// }

	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res.status(200).send(user);
	} else {
		user = new User({
			uid: req.body.uid,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			profileImage: req.body.profileImage,
		});

		await user.save();
		res.status(201).send({ data: "User Created Successfully." });
	}
});

// Get the number of posts of a particular user
router.get("/:id/posts", auth, async (req, res) => {
	const posts = await Post.find();
	const userPosts = posts.filter((post) => post.user._id == req.params.id);
	res.status(200).send(userPosts);
});

module.exports = router;
