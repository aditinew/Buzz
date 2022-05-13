import React, { useEffect, useState } from "react";
import "./ViewProfile.css";
import { HiUserAdd } from "react-icons/hi";
import { AiOutlineSelect, AiFillDelete } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import { useParams } from "react-router-dom";
import { auth } from "../../config/Firebase/Firebase";
import Header from "../Header/Header";
import cover from "../../static/images/cover-picture.jpeg";
import { GLOBAL_URL } from "../../config/global/contant";
import { FaUserFriends } from "react-icons/fa";
import useAuth from "../../config/context/AuthContext";

export default function ViewProfile() {
	const [user, setUser] = useState({});
	const { id } = useParams();
	const { userData } = useAuth();
	const [reload, setReload] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			const token = await auth.currentUser.getIdToken();
			await axios
				.get(`${GLOBAL_URL}/api/auth/${id}/profile`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setUser(res.data);
					console.log(res.data);
				})
				.catch((err) => {
					console.log(err.response);
				});
		};
		getUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reload]);

	useEffect(() => {
		const updateViews = async () => {
			const token = await auth.currentUser.getIdToken();
			await axios.put(
				`${GLOBAL_URL}/api/auth/${id}/addViews`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		};
		const viewer = setTimeout(async () => {
			await updateViews();
		}, 5000);

		return () => {
			clearTimeout(viewer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sendFriendRequest = async () => {
		const token = await auth.currentUser.getIdToken();
		await axios
			.put(
				`${GLOBAL_URL}/api/auth/${id}/sendFriendRequest`,
				{
					userId: userData._id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				console.log(res.data);
				setReload(!reload);
			})
			.catch((err) => {
				console.log(err.response);
			});
	};

	const acceptFriendRequest = async () => {
		const token = await auth.currentUser.getIdToken();
		await axios
			.put(
				`${GLOBAL_URL}/api/auth/${id}/acceptFriendRequest`,
				{
					userId: userData._id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				console.log(res.data);
				setReload(!reload);
			})
			.catch((err) => {
				console.log(err.response);
			});
	};

	return (
		<>
			<Header />
			<div className="viewProfile container">
				<div className="profile">
					<div className="profileRight">
						<div className="profileRightTop">
							<div
								className="profileCover"
								style={{ position: "relative" }}
							>
								<img
									className="coverImage"
									src={user.coverImage || cover}
									alt=""
									style={{
										height: "300px",
										width: "100%",
										objectFit: "contain",
										zIndex: "1",
									}}
								/>
								<img
									className="coverImage"
									src={user.coverImage || cover}
									alt=""
									style={{
										height: "300px",
										position: "absolute",
										zIndex: "0",
										width: "100%",
										filter: "blur(15px)",
										borderRadius: "10px",
									}}
								/>
								<img
									className="userImage img-thumbnail"
									src={user.profileImage}
									alt=""
									style={{
										height: "120px",
										width: "120px",
										zIndex: 1,
										position: "absolute",
										left: "20px",
									}}
								/>
							</div>
						</div>
						<div className="forMargin">
							<div className="profileInfo1">
								<h4 className="profileInfoName1">{`${user.firstName} ${user.lastName}`}</h4>
								{user.designation && (
									<span className="profileInfoDesc1">
										{`${user.firstName} ${user.lastName} is a ${user.designation}`}
									</span>
								)}
							</div>
							<div className="profileRightBottom1">
								{!user.friendRequestsReceived?.includes(
									userData._id
								) &&
									!user.friendRequestsSent?.includes(
										userData._id
									) &&
									!user.friends?.includes(userData._id) && (
										<button
											className="addFriendButton"
											onClick={() => sendFriendRequest()}
										>
											<HiUserAdd className="viewProfileIcon" />
											Add Friend
										</button>
									)}
								{user.friendRequestsReceived?.includes(
									userData._id
								) && (
									<button
										className="sendFriendRequest"
										style={{ cursor: "default" }}
									>
										<IoIosSend className="viewProfileIcon" />
										Request Sent
									</button>
								)}
								{user.friendRequestsSent?.includes(
									userData._id
								) && (
									<button
										className="deleteFriendRequest"
										onClick={() => acceptFriendRequest()}
									>
										<AiFillDelete className="viewProfileIcon" />
										Accept Request
									</button>
								)}
								{user.friends?.includes(userData._id) && (
									<button
										className="friendAddedButton"
										style={{ cursor: "default" }}
									>
										<FaUserFriends className="friendNowIcon" />
										Friends
									</button>
								)}
								{user.website && (
									<a
										href={user.website}
										target="_blank"
										rel="noreferrer"
									>
										<button className="visitWebsiteButton">
											<AiOutlineSelect className="viewProfileIcon" />
											Visit Website
										</button>
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
