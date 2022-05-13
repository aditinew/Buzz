import React from "react";
import { Route, Routes } from "react-router-dom";
import Feeds from "../../components/Feed/Feeds";
import Login from "../../components/Login/Login";
import Profile from "../../components/Porfile/Profile";
import ViewProfile from "../../components/ViewProfile/ViewProfile";
import PrivateRoute from "./PrivateRoute";

const Router = () => {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<PrivateRoute />}>
				<Route path="/" element={<Feeds />} />
			</Route>
			<Route path="/profile" element={<PrivateRoute />}>
				<Route path="/profile" element={<Profile />} />
			</Route>
			<Route path="/:id/user" element={<PrivateRoute />}>
				<Route path="/:id/user" element={<ViewProfile />} />
			</Route>
		</Routes>
	);
};

export default Router;
