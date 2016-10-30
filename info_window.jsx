function fillBubble(props) {

	console.log("here");
	const artists = props.map((artist, index) => 
		<div className="info-content">
		<a href={musicians[artist.id].images[0].url} target="_blank"></a>
		</div>
		);

	const fullBubble = (
		<div class="info-window">
			<h4>Artists From This Area</h4>
			{artists}
		</div>
		);


	return fullBubble;
}