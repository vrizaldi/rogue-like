import React from "react";
import { Link } from "react-router";

export default class Layout extends React.Component {

	constructor() {
		super();	
	}

	newGame() {}

	render() {
		return(
		<div>
			<Link to="play">
				<h1>Dungeon Crawler</h1>
				{this.props.children}
			</Link>
		</div>
		);
	}
}
