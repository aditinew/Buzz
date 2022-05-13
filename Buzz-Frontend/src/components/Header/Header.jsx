import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsFillPersonPlusFill } from "react-icons/bs";
import useAuth from "../../config/context/AuthContext";
import "./Header.css";
import { auth } from "../../config/Firebase/Firebase";
import axios from "axios";
import { toast } from "react-toastify";
import { GLOBAL_URL } from "../../config/global/contant";

const Header = () => {
	const { user, logout, userData } = useAuth();
	const [suggestion, setSuggestion] = useState([]);

	useEffect(() => {
		const getUsers = async () => {
			const token = await auth.currentUser.getIdToken();
			await axios
				.get(`${GLOBAL_URL}/api/auth/users`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => setSuggestion(res.data))
				.catch((err) => toast.error("Oops! Something went wrong!"));
		};
		getUsers();
	}, []);

	return (
		<header className="header position-sticky top-0" style={{ zIndex: 12 }}>
			<h1 className="header__brand">
				<NavLink to="/">BUZZ</NavLink>
			</h1>
			<div className="header__right">
				<div class="dropdown">
					<div
						className="headerIcon"
						id="dropdownMenuButton1"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<BsFillPersonPlusFill className="friendListIcon" />
					</div>
					<ul
						class="dropdown-menu"
						aria-labelledby="dropdownMenuButton1"
						style={{width: "350px"}}
					>
						{userData.friendRequestsReceived.length > 0 ? (
							suggestion.filter(user => userData?.friendRequestsReceived.includes(user._id)).map((user) => (
								<Link to={`/${user._id}/user`}>
									<li className="rightbarContact m-3 p-3">
										<div className="rightbarProfileImgContainer">
											<div>
												<img
													className="rightbarProfileImg"
													src={user.profileImage}
													alt=""
												/>
												<span className="rightbarContactName">{`${user.firstName} ${user.lastName}`}</span>
											</div>
										</div>
									</li>
								</Link>
							))
						) : (
							<li className="rightbarContact m-3 p-3">
								<div className="rightbarProfileImgContainer">
									<div>
										<span className="rightbarContactName">{`No Requests Received`}</span>
									</div>
								</div>
							</li>
						)}
					</ul>
				</div>

				<div className="dropdown">
					<div
						className="header__right"
						id="dropdownMenuLink"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<img src={userData?.profileImage} alt="" />
						<p>{`${userData?.firstName} ${userData?.lastName}`}</p>
					</div>
					<ul
						className="dropdown-menu"
						aria-labelledby="dropdownMenuLink"
					>
						<li>
							<NavLink to={"/profile"} className="dropdown-item">
								Profile
							</NavLink>
						</li>
						<li>
							<hr className="dropdown-divider" />
						</li>
						<li>
							<a
								className="dropdown-item"
								onClick={() => logout()}
							>
								Logout
							</a>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
};

export default Header;
