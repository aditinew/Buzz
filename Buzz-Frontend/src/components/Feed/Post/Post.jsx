import React, { useEffect, useState } from "react";
import "./Post.css";
import {
	FaEllipsisH,
	FaThumbsUp,
	FaHeartBroken,
	FaFlag,
	FaCommentDots,
} from "react-icons/fa";
import axios from "axios";
import useAuth from "../../../config/context/AuthContext";
import { auth } from "../../../config/Firebase/Firebase";
import moment from "moment";
import { toast } from "react-toastify";
import { GLOBAL_URL } from "../../../config/global/contant";

const Post = ({ post, userType }) => {
	const [date, setDate] = useState("");
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [commentChanged, setCommentChanged] = useState(false);
	const [reaction, setReaction] = useState(null);
	const [reported, setReported] = useState(false);
	const { user, userData } = useAuth();

	useEffect(() => {
		if (post.dateCreated) {
			const date = new Date(post.dateCreated);
			const options = {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
			};
			setDate(date.toLocaleDateString("en-US", options));
		}
	}, []);

	useEffect(() => {
		const getComments = async () => {
			const token = await auth.currentUser.getIdToken();
			await axios
				.get(`${GLOBAL_URL}/api/posts/${post._id}/comments`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setComments(res.data);
				})
				.catch((err) => console.log(err));
		};
		getComments();
	}, [commentChanged]);

	const commentOnPost = async () => {
		const token = await auth.currentUser.getIdToken();
		await axios
			.post(
				`${GLOBAL_URL}/api/posts/${post._id}/comments`,
				{ comment },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				console.log(res)
				setComment("");
				setCommentChanged(!commentChanged);
			})
			.catch((err) => console.log(err.response));
	};

	useEffect(() => {
		const sendReaction = async () => {
			const token = await auth.currentUser.getIdToken();
			await axios
				.post(
					`${GLOBAL_URL}/api/posts/${post._id}/reaction`,
					{ reaction },
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => console.log(err.response));
		};
		sendReaction();
	}, [reaction]);

	const reportPost = async () => {
		const token = await auth.currentUser.getIdToken();
		await axios
			.post(
				`${GLOBAL_URL}/api/posts/${post._id}/report`,
				{ reported: true },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				toast.success("Post reported successfully");
			})
			.catch((err) => toast.error("Error reporting post"));
	};

	const removeReportPost = async () => {
		const token = await auth.currentUser.getIdToken();
		await axios
			.post(
				`${GLOBAL_URL}/api/posts/${post._id}/report`,
				{ reported: false },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				toast.success("Post unreported successfully");
			})
			.catch((err) => toast.error("Error reporting post"));
	};

	return (
		<div className="post__container">
			<div className="post__header">
				<div className="post__headerLeft">
					<div className="post__headerImage">
						<img src={post.user.profileImage} alt="porfile" />
					</div>
					<div className="post__headerProfileDetails">
						<p className="post__headerProfileName">{`${post.user.firstName} ${post.user.lastName}`}</p>
						<p className="post__headerDate">{date}</p>
					</div>
				</div>
				<div className="post__headerRight dropdown">
					{ userType !== "User" && userData?.isAdmin && (
						<>
							<div
								className="post__headerOptions dropdown-toggle"
								id="dropdownMenuButton1"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<FaEllipsisH color="#5E5E5E" size="1rem" />
							</div>
							<ul
								class="dropdown-menu"
								aria-labelledby="dropdownMenuButton1"
							>
								<li>
									<a
										class="dropdown-item cursor-pointer"
										onClick={() => {
											setReported(false);
											removeReportPost();
										}}
									>
										Remove Report Tag
									</a>
								</li>
							</ul>
						</>
					)}
				</div>
			</div>
			<div className="post__description">
				<p>{post.caption}</p>
				{post.images.length > 0 && (
					<div
						id={`image${post._id}`}
						className="carousel carousel-dark slide"
						data-bs-ride="carousel"
					>
						<div className="carousel-inner">
							{post.images.map((image, index) => (
								<div
									className={`carousel-item ${
										index === 0 ? "active" : ""
									}`}
									key={index}
								>
									<img
										src={image}
										className="d-block w-100"
										alt="image"
									/>
								</div>
							))}
						</div>
						<button
							className="carousel-control-prev"
							type="button"
							data-bs-target={`#image${post._id}`}
							data-bs-slide="prev"
						>
							<span
								className="carousel-control-prev-icon"
								aria-hidden="true"
							></span>
							<span className="visually-hidden">Previous</span>
						</button>
						<button
							className="carousel-control-next"
							type="button"
							data-bs-target={`#image${post._id}`}
							data-bs-slide="next"
						>
							<span
								className="carousel-control-next-icon"
								aria-hidden="true"
							></span>
							<span className="visually-hidden">Next</span>
						</button>
					</div>
				)}
			</div>
			<div className="post__footer">
				<div className="post__footerDescription">
					<div className="post__footerDescLeft">
						<div>
							<span className="post__footerLikeIcon">
								<FaThumbsUp
									color="#fff"
									size="15px"
									style={{
										width: "20px",
									}}
								/>
							</span>
							{post.likes.length}
						</div>
						<div>
							<span className="post__footerDislikeIcon">
								<FaHeartBroken
									color="#fff"
									size="15px"
									style={{
										width: "20px",
									}}
								/>
							</span>
							{post.dislikes.length}
						</div>
					</div>
					<div className="post__footerDescRight">
						<div
							data-bs-toggle="modal"
							data-bs-target={`#commentModal${post._id}`}
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<div className="post__footerCommentIcon">
								<FaCommentDots
									color="#fff"
									size="15px"
									style={{
										width: "20px",
									}}
								/>
							</div>
							{post.comments.length}
						</div>
					</div>
				</div>
				<div className="post__footerActions">
					<div
						className="post__likeBtn"
						onClick={() => setReaction("like")}
					>
						{reaction === "like" ||
						post.likes.find((like) => like.user === user.uid) ? (
							<>
								<FaThumbsUp
									color="#00f"
									size="20px"
									style={{
										width: "20px",
										marginRight: "10px",
									}}
								/>
								<div style={{ color: "blue" }}>Liked</div>
							</>
						) : (
							<>
								<FaThumbsUp
									color="#000"
									size="20px"
									style={{
										width: "20px",
										marginRight: "10px",
									}}
								/>
								Like
							</>
						)}
					</div>
					<div
						className="post__dislikeBtn"
						onClick={() => setReaction("dislike")}
					>
						{reaction === "dislike" ||
						post.dislikes.find(
							(dislike) => dislike.user === user.uid
						) ? (
							<>
								<FaHeartBroken
									color="#f00"
									size="20px"
									style={{
										width: "20px",
										marginRight: "10px",
									}}
								/>
								<div style={{ color: "red" }}>Disliked</div>
							</>
						) : (
							<>
								<FaHeartBroken
									color="#000"
									size="20px"
									style={{
										width: "20px",
										marginRight: "10px",
									}}
								/>
								Dislike
							</>
						)}
					</div>
					<div
						className="post__reportBtn"
						onClick={() => {
							setReported(true);
							reportPost();
						}}
					>
						{reported || post.reported ? (
							<>
								<FaFlag
									color="#f0f"
									size="20px"
									style={{
										width: "20px",
										marginRight: "10px",
									}}
								/>
								<div style={{ color: "#f0f" }}>Reported</div>
							</>
						) : (
							<>
								<FaFlag
									color="#000"
									size="20px"
									style={{
										width: "20px",
										marginRight: "10px",
									}}
								/>
								Report
							</>
						)}
					</div>
				</div>
				<div className="post__commentForm">
					<img src={userData.profileImage} alt="" />
					<input
						type="text"
						placeholder="Write a comment"
						name=""
						id=""
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<div className="Button" onClick={() => commentOnPost()}>
						POST
					</div>
				</div>
			</div>

			<div
				className="modal fade"
				id={`commentModal${post._id}`}
				tabIndex="-1"
				aria-labelledby={`commentModalLabel${post._id}`}
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5
								className="modal-title"
								id={`commentModalLabel${post._id}`}
							>
								Comments
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							{comments.length > 0 ? (
								comments.map((comment, index) => (
									<div className="comment" key={index}>
										<div className="comment__header">
											<img
												src={comment.profileImage}
												alt=""
											/>
											<div className="comment__headerInfo">
												<div className="comment__headerInfoName">
													{comment.name}
													<span className="comment__headerInfoTime">
														{moment(
															comment.dateCreated
														).fromNow()}
													</span>
												</div>
												<div className="comment__headerInfoText">
													{comment.comment}
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<h3>No Comments</h3>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
