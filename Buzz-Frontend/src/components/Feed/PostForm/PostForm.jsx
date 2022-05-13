import React, { useRef, useState } from "react";
import "./PostForm.css";
import { FaImages, FaTimesCircle } from "react-icons/fa";
import { getDownloadURL, ref as storeRef, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../../config/Firebase/Firebase";
import axios from "axios";
import useAuth from "../../../config/context/AuthContext";
import { GLOBAL_URL } from "../../../config/global/contant";
import { toast } from "react-toastify";

const PostForm = () => {
	const [formOpen, setFormOpen] = useState(false);
	const [caption, setCaption] = useState("");
	const [images, setImages] = useState([]);
	const [imageUploading, setImageUploading] = useState(false);

	const { userData, getPosts } = useAuth();

	const imageUploadRef = useRef(null);

	const uploadImages = async () => {
		setImageUploading(true);
		const files = imageUploadRef.current.files;
		const filesArray = Array.from(imageUploadRef.current.files);
		if (filesArray.length > 6) {
			alert("You can only upload a maximum of 6 images");
			setImageUploading(false);
			return;
		} else {
			for (let i = 0; i < filesArray.length; i++) {
				const storageRef = storeRef(storage, `Posts/${files[i].name}`);
				await uploadBytes(storageRef, files[i]).then(
					async (snapshot) => {
						const fileRef = storeRef(
							storage,
							`Posts/${files[i].name}`
						);
						await getDownloadURL(fileRef).then((url) => {
							setImages((prevImages) => [...prevImages, url]);
						});
					}
				);
			}
			setImageUploading(false);
		}
	};

	const handlePostSubmit = async () => {
		const token = await auth.currentUser.getIdToken();
		await axios
			.post(
				`${GLOBAL_URL}/api/posts`,
				{
					caption,
					images,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				setCaption("");
				setImages([]);
				setFormOpen(false);
				getPosts();
			})
			.catch((err) => {
				toast.error("Something went wrong");
			});
	};

	return (
		<div className="postform__container" onFocus={() => setFormOpen(true)}>
			<div className="postform__imageContainer">
				<img src={userData.profileImage} alt="" />
			</div>
			<div className="postform__inputContainer">
				<textarea
					name=""
					placeholder="Start a post..."
					id=""
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					rows={formOpen ? 5 : 1}
				></textarea>
				{formOpen && (
					<>
						<FaTimesCircle
							style={{
								position: "absolute",
								right: "10px",
								top: "10px",
								cursor: "pointer",
							}}
							color="rgb(236, 103, 103)"
							size="1.5em"
							onClick={() => setFormOpen(false)}
						/>
						<div className="postform__imageUploadContainer">
							<input
								type="file"
								name=""
								ref={imageUploadRef}
								style={{ display: "none" }}
								multiple
								accept="image/*"
								id=""
								onChange={() => uploadImages()}
							/>
							<div
								onClick={() => imageUploadRef.current.click()}
								className="postform__imageUploadButton"
							>
								<FaImages color="green" size="2em" />
								<p>Photo(s)</p>
								{imageUploading && (
									<div class="spinner-border" role="status">
										<span class="visually-hidden">
											Loading...
										</span>
									</div>
								)}
							</div>
							<div className="postform__uploadedImages">
								{images.map((image) => (
									<img src={image} alt="" />
								))}
							</div>
						</div>
						<button
							disabled={caption.trim() === ""}
							onClick={() => handlePostSubmit()}
						>
							POST
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default PostForm;
