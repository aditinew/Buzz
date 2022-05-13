import React, { useEffect } from "react";
import "./Login.css";
import logo from "../../static/images/Company-Logo/To-The-New-Logo.png";
import useAuth from "../../config/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const { signInWithGoogle, user } = useAuth();

	const handleGoogleSignIn = async () => {
		await signInWithGoogle();
	};
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	return (
		<div className="login">
			<div className="loginBox">
				<div className="loginLeftBox">
					<div className="companyLogo">
						<img src={logo} alt="" />
					</div>
					<h4 className="loginDesc1">
						Enter your details and Start your journey with us
					</h4>
					<span className="loginDesc2">
						Don't stop until you're proud
					</span>
					<button
						className="buttonGoogle"
						onClick={handleGoogleSignIn}
					>
						Sign in with Google
					</button>
				</div>
				{/* <div className="loginRightBox">
					<div className="loginBox2">
						<h3 className="head">Login To Your Account</h3>
						<input
							className="loginInput"
							placeholder="TTN Username"
						/>
						<input className="loginInput" placeholder="Password" />
						<div className="checkbox">
							<span className="rememberMe">
								<input
									type="checkbox"
									id="checkbox"
									name="identity"
									value="rememberMee"
								/>
								<label htmlFor="identity">
									Remember&nbsp;Me
								</label>
							</span>
							<div className="loginforgot">Forgot Password?</div>
						</div>
						<button className="loginButton">Sign In</button>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Login;
