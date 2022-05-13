import React from "react";
import "./Footer.css";
import logo from "../../static/images/Company-Logo/To-The-New-Logo.png";

const Footer = () => {
	return (
		<div className="card text-center">
			<div className="card-body">
				<img className="ttnLogo" src={logo} alt="" />
				<h5 className="card-title">BUZZ</h5>
				<p className="card-text">Made by Aditi, Alankar, Amit</p>
			</div>
			<div className="card-footer">Copyright&copy;2022</div>
		</div>
	);
};

export default Footer;
