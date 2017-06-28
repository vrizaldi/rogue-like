import React from "react";

export default class Instruction extends React.Component {

	render() {
		return(
		<div id="instruction">
			<h2>How to Play</h2>
			<ol>
				<li>Use arrow keys to move</li>
				<li>Run around the dungeon, killing monsters</li>
				<li>Have (a little) fun!</li>
			</ol>
			<p className="red-text">Click to start playing</p>
		</div>
		);
	}
}
