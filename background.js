function handleMatch(match) {
	new Notification("Match found", {body: match});
	const audio = new Audio(browser.runtime.getURL("static/notif.mp3"));
	audio.play();
}


function handleMessage(request) {
	if (request.type == "match")
		return handleMatch(request.match);
}

browser.runtime.onMessage.addListener(handleMessage);
