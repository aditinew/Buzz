import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuth from "../../config/context/AuthContext";
import Header from "../Header/Header";
import Post from "./Post/Post";
import PostForm from "./PostForm/PostForm";
import Sidebar from "./Sidebar/Sidebar";
import Rightbar from "./Rightbar/Rightbar";

const Feeds = () => {
	const { posts, getPosts, userData, loading } = useAuth();
	const [userType, setUserType] = useState("Admin");
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		getPosts();
	}, [posts]);

	useEffect(() => {
		setUserType(() => (checked ? "Admin" : "User"));
	}, [checked]);

	return (
		<div>
			<Header />
			<div
				style={{
					display: "flex",
					gap: "20px",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<div
					style={{
						flex: 1,
						marginLeft: "10px",
						position: "sticky",
						top: "60px",
					}}
				>
					<Sidebar />
				</div>
				<div style={{ flex: 2 }}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
							height: "100%",
							backgroundColor: "#f5f5f5",
						}}
					>
						<PostForm />
						{userData?.isAdmin && (
							<div className="d-flex justify-content-end w-100">
								<div class="form-check form-switch position-relative">
									<input
										class="form-check-input"
										type="checkbox"
										role="switch"
										id="moderatorSwitch"
										style={{
											height: "30px",
											width: "100px",
										}}
										checked={checked}
										onChange={() => setChecked(!checked)}
									/>
									<label
										onClick={() => setChecked(!checked)}
										style={{
											position: "absolute",
											top: "5px",
											left: checked ? "10px" : "",
											right: checked ? "" : "10px",
											zIndex: "1",
											transition: "all 0.3s ease-in-out",
											fontWeight: "bold",
											color: checked ? "#fff" : "#000",
										}}
										className="form-check-label position-absolute"
									>
										{userType}
									</label>
								</div>
							</div>
						)}
						{userType === "Admin" ? (
							posts.filter((post) => post.reported === true)
								.length > 0 ? (
								posts
									.filter((post) => post.reported === true)
									.map((p) => <Post key={p._id} post={p} />)
							) : (
								<div className="h1">No post reported</div>
							)
						) : (
							posts.map((post) => (
								<Post
									key={post._id}
									post={post}
									userType={userType}
								/>
							))
						)}
					</div>
				</div>

				<div
					style={{
						flex: 1,
						marginRight: "10px",
						position: "sticky",
						top: "60px",
					}}
				>
					<Rightbar />
				</div>
			</div>
		</div>
	);
};

export default Feeds;
