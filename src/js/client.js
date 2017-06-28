import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router"; 

import Layout from "./Layout";
import Instruction from "./Instruction";
import Board from "./Board";

const app = document.getElementById("app");
ReactDOM.render(
		<Router>
			<Route path="/" component={Layout}>
				<IndexRoute component={Instruction}></IndexRoute>
				<Route path="play" component={Board}></Route>
			</Route>
		</Router>
	, app);
