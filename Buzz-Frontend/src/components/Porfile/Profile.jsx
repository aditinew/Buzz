import React, { useRef, useState } from "react";
import "./Profile.css";
import coverimage from "./pexels.jpg";
import Header from "../Header/Header";
import useAuth from "../../config/context/AuthContext";
import axios from "axios";
import { auth, storage } from "../../config/Firebase/Firebase";
import { toast } from "react-toastify";
import { GLOBAL_URL } from "../../config/global/contant";
import { FaEdit } from "react-icons/fa";
import { getDownloadURL, ref as storeRef, uploadBytes } from "firebase/storage";

const Profile = () => {
	const { userData, setUserData } = useAuth();
	const [firstName, setfirstName] = useState(userData.firstName);
	const [lastName, setlastName] = useState(userData.lastName);
	const [designation, setdesignation] = useState(userData.designation);
	const [website, setwebsite] = useState(userData.website);
	const [gender, setgender] = useState(userData.gender);
	const [birthday, setbirthday] = useState(userData.dateOfBirth);
	const [city, setcity] = useState(userData.city);
	const [state, setstate] = useState(userData.state);
	const [zip, setzip] = useState(userData.pincode);
	const [profileImage, setProfileImage] = useState(userData.profileImage);
	const [coverImage, setCoverImage] = useState(
		userData?.coverImage || coverimage
	);
	const [profileImageLoading, setProfileImageLoading] = useState(false);
	const [coverImageLoading, setCoverImageLoading] = useState(false);

	const userUpdateProfile = async (e) => {
		e.preventDefault();
		const token = await auth.currentUser.getIdToken();
		await axios
			.post(
				`${GLOBAL_URL}/api/auth/${userData._id}/userprofile`,
				{
					firstName: firstName,
					lastName: lastName,
					designation: designation,
					website: website,
					gender: gender,
					dateOfBirth: birthday,
					city: city,
					state: state,
					pincode: zip,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				console.log(res);
				setUserData({ ...userData, ...res.data });
				toast.success("user profile updated successfully");
			})
			.catch((err) => {
				console.log(err);
				toast.error("something went wrong");
			});
	};

	const profileImageUploadRef = useRef(null);
	const coverImageUploadRef = useRef(null);

	const handleProfileImageUpload = async (e) => {
		setProfileImageLoading(true);
		const files = profileImageUploadRef.current.files[0];
		const storageRef = storeRef(storage, `ProfilePics/${files.name}`);
		await uploadBytes(storageRef, files)
			.then(async (snapshot) => {
				const fileRef = storeRef(storage, `ProfilePics/${files.name}`);
				await getDownloadURL(fileRef).then(async (url) => {
					setProfileImage(url);
					const token = await auth.currentUser.getIdToken();
					await axios
						.post(
							`${GLOBAL_URL}/api/auth/${userData._id}/profileImage`,
							{
								profileImage: url,
							},
							{
								headers: {
									Authorization: `Bearer ${token}`,
								},
							}
						)
						.then((res) => {
							console.log(res);
							setUserData({
								...userData,
								profileImage: res.data.profileImage,
							});
							setProfileImageLoading(false);
							toast.success("Profile Image updated successfully");
						})
						.catch((err) => {
							console.log(err);
							toast.error("Something went wrong");
						});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleCoverImageUpload = async (e) => {
		setCoverImageLoading(true);
		const files = coverImageUploadRef.current.files[0];
		const storageRef = storeRef(storage, `CoverPics/${files.name}`);
		await uploadBytes(storageRef, files)
			.then(async (snapshot) => {
				const fileRef = storeRef(storage, `CoverPics/${files.name}`);
				await getDownloadURL(fileRef).then(async (url) => {
					setCoverImage(url);
					const token = await auth.currentUser.getIdToken();
					await axios
						.post(
							`${GLOBAL_URL}/api/auth/${userData._id}/coverImage`,
							{
								coverImage: url,
							},
							{
								headers: {
									Authorization: `Bearer ${token}`,
								},
							}
						)
						.then((res) => {
							console.log(res);
							setUserData({
								...userData,
								coverImage: res.data.coverImage,
							});
							setCoverImageLoading(false);
							toast.success("Cover Image updated successfully");
						})
						.catch((err) => {
							console.log(err);
							toast.error("Something went wrong");
						});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<Header />
			<div className="container position-relative">
				{coverImageLoading ? (
					<div
						className="d-flex justify-content-center align-items-center bg-white"
						style={{
							width: "100%",
							height: "250px",
						}}
					>
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					</div>
				) : (
					<>
						<img
							src={coverImage}
							className="img-fluid"
							style={{
								height: "250px",
								width: "100%",
								objectFit: "contain",
							}}
							alt="image"
						/>
						<img
							src={coverImage}
							className="img-fluid"
							style={{
								height: "250px",
								width: "100%",
								objectFit: "cover",
								position: "absolute",
								left: "0",
								zIndex: "-1",
								filter: "blur(15px)",
							}}
							alt="image"
						/>
						<input
							type="file"
							style={{
								display: "none",
							}}
							ref={coverImageUploadRef}
							accept="image/*"
							onChange={(e) => {
								handleCoverImageUpload(e);
							}}
						/>
						<div
							className="position-absolute p-2 rounded-circle bg-white"
							style={{
								bottom: "10px",
								right: "20px",
								cursor: "pointer",
							}}
							onClick={() => {
								coverImageUploadRef.current.click();
							}}
						>
							<FaEdit color="#5E5E5E" size="1.5rem" />
						</div>
					</>
				)}
				<div
					className="position-absolute d-flex justify-content-center align-items-center"
					style={{ bottom: "-30px", left: "30px" }}
				>
					<div className="position-relative">
						{profileImageLoading ? (
							<div
								className="rounded-circle img-thumbnail d-flex justify-content-center align-items-center"
								style={{
									width: "140px",
									height: "140px",
									bottom: "30px",
								}}
							>
								<div
									class="spinner-border text-primary"
									role="status"
								>
									<span class="visually-hidden">
										Loading...
									</span>
								</div>
							</div>
						) : (
							<>
								<img
									src={profileImage}
									className="rounded-circle img-thumbnail"
									style={{
										bottom: "30px",
										height: "140px",
										width: "140px",
										objectFit: "cover",
									}}
									alt="profile_image"
								/>
								<input
									type="file"
									style={{
										display: "none",
									}}
									ref={profileImageUploadRef}
									accept="image/*"
									onChange={(e) => {
										handleProfileImageUpload(e);
									}}
								/>
								<div
									className="position-absolute"
									style={{
										bottom: "0px",
										right: "0px",
										cursor: "pointer",
									}}
									onClick={() => {
										profileImageUploadRef.current.click();
									}}
								>
									<FaEdit color="#5E5E5E" size="1.5rem" />
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="container">
				<hr className="mt-5" />
				<h2>
					{userData.firstName} {userData.lastName}
				</h2>
			</div>

			<div class="container">
				<form class="form-inline" action="">
					<div className="row">
						<div class="col-md-6">
							<label for="FirstNAme">FirstName</label>
							<input
								class="form-control"
								id="FirstNAme"
								value={firstName}
								onChange={(e) => setfirstName(e.target.value)}
								type="text"
								placeholder="First Name"
							/>{" "}
						</div>
						<div class="col-md-6">
							<label htmlFor="LastName">LastName</label>
							<input
								class="form-control"
								type="text"
								name="LastName"
								value={lastName}
								onChange={(e) => setlastName(e.target.value)}
								id="LastName"
								placeholder="Last Name"
							/>
						</div>
					</div>
					<div className=" row">
						<div className="col-md-6">
							<label htmlFor="Designation">Designation</label>
							<input
								class="form-control"
								type="text"
								name="Designation"
								value={designation}
								onChange={(e) => setdesignation(e.target.value)}
								id="Designation"
								placeholder="Designation"
							/>
						</div>
						<div className="col-md-6">
							<label htmlFor="My Website">My Website</label>
							<input
								class="form-control"
								type="text"
								name="My Website"
								value={website}
								onChange={(e) => setwebsite(e.target.value)}
								id="My Website"
								placeholder="website.org"
							/>
						</div>
					</div>
					<div className=" row">
						<div className="col-md-6">
							<label for="Gender">Gender</label>
							<select
								className="form-select mt-2"
								name="Gender"
								id="Gender"
								value={gender}
								onChange={(e) => setgender(e.target.value)}
							>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">other</option>
							</select>
						</div>
						<div className="col-md-6">
							<label for="Birthday">Birthday</label>
							<input
								class="form-control"
								type="date"
								name="Birthday"
								id="Birthday"
								value={birthday?.slice(0, 10)}
								min="1940-01-01"
								max="2010-01-01"
								onChange={(e) => setbirthday(e.target.value)}
							/>
						</div>
					</div>
					<div className=" row">
						<div className="col-md-6">
							<label htmlFor="City">City</label>
							<input
								class="form-control"
								type="text"
								name="City"
								id="City"
								value={city}
								onChange={(e) => setcity(e.target.value)}
							/>
						</div>

						<div className="col-md-3">
							<label for="State">State</label>
							<select
								className="form-select mt-2"
								name="State"
								id="State"
								value={state}
								onChange={(e) => setstate(e.target.value)}
							>
								<option value="Andhra Pradesh">
									Andhra Pradesh
								</option>
								<option value="Andaman and Nicobar Islands">
									Andaman and Nicobar Islands
								</option>
								<option value="Arunachal Pradesh">
									Arunachal Pradesh
								</option>
								<option value="Assam">Assam</option>
								<option value="Bihar">Bihar</option>
								<option value="Chandigarh">Chandigarh</option>
								<option value="Chhattisgarh">
									Chhattisgarh
								</option>
								<option value="Dadar and Nagar Haveli">
									Dadar and Nagar Haveli
								</option>
								<option value="Daman and Diu">
									Daman and Diu
								</option>
								<option value="Delhi">Delhi</option>
								<option value="Lakshadweep">Lakshadweep</option>
								<option value="Puducherry">Puducherry</option>
								<option value="Goa">Goa</option>
								<option value="Gujarat">Gujarat</option>
								<option value="Haryana">Haryana</option>
								<option value="Himachal Pradesh">
									Himachal Pradesh
								</option>
								<option value="Jammu and Kashmir">
									Jammu and Kashmir
								</option>
								<option value="Jharkhand">Jharkhand</option>
								<option value="Karnataka">Karnataka</option>
								<option value="Kerala">Kerala</option>
								<option value="Madhya Pradesh">
									Madhya Pradesh
								</option>
								<option value="Maharashtra">Maharashtra</option>
								<option value="Manipur">Manipur</option>
								<option value="Meghalaya">Meghalaya</option>
								<option value="Mizoram">Mizoram</option>
								<option value="Nagaland">Nagaland</option>
								<option value="Odisha">Odisha</option>
								<option value="Punjab">Punjab</option>
								<option value="Rajasthan">Rajasthan</option>
								<option value="Sikkim">Sikkim</option>
								<option value="Tamil Nadu">Tamil Nadu</option>
								<option value="Telangana">Telangana</option>
								<option value="Tripura">Tripura</option>
								<option value="Uttar Pradesh">
									Uttar Pradesh
								</option>
								<option value="Uttarakhand">Uttarakhand</option>
								<option value="West Bengal">West Bengal</option>
							</select>
						</div>

						<div className="col-md-3">
							<label htmlFor="Zip">Zip</label>
							<input
								class="form-control"
								type="number"
								maxLength={6}
								placeholder="201310"
								value={zip}
								onChange={(e) => setzip(e.target.value)}
							/>
						</div>
					</div>
					<div className="row mt-4">
						<div className="col-md-12">
							<button
								type="submit"
								onClick={(e) => userUpdateProfile(e)}
								class="btn btn-primary float-end"
							>
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Profile;
