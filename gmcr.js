let lastNotification = "";
function surroundText(haystack, wordList, padding) {
	let surroundingText = "";
	wordList.forEach(word => {
		if (word.idx < 0)
			return;
		const start = Math.max(0, word.idx - padding);
		const end = word.idx + word.length + padding;
		if (start > 0)
			surroundingText += "...";
		surroundingText += haystack.slice(start, end).trim();
		if (end < haystack.length)
			surroundingText += "...";

		surroundingText += "<br>";
		console.log(start, end, surroundingText);
	});
	return surroundingText.trim();
}

function simpleMatch(captions, words) {
	const wordList = words.map(word => ({
		idx: captions.toLowerCase().indexOf(word.toLowerCase()),
		length: word.length
	})).filter(i => i.idx >= 0);
	const surroundingText = surroundText(captions, wordList, 10);
	return [ wordList.length, surroundingText ];
}

function advancedMatch(captions, regex, flags) {
	const reg = RegExp(regex, flags);
	let wordList = [];
	if (reg.global) {
		wordList = [...captions.matchAll(reg)].map(i => ({ idx: i.index, length: i[0].length }));
	} else {
		const match = captions.match(reg);
		if (match.length)
			wordList = [ {idx: match.index, length: match[0].length} ];
	}
	const surroundingText = surroundText(captions, wordList, 10);
	return [ Boolean(wordList.length), surroundingText ];
}

function captionUpdate() {
	const captions = [...document.querySelector(".a4cQT").children].map(i => i.innerText).reduce((i, j) => i + "\n" + j);
	browser.storage.local.get(["advanced", "flags", "regex", "words"])
		.then(storage => {
			let surroundingText = "";
			let matched = false;
			if (storage.advanced) {
				[ matched, surroundingText ] = advancedMatch(captions, storage.regex, storage.flags);
			} else {
				[ matched, surroundingText ] = simpleMatch(captions, storage.words);
			}
			console.log(matched, surroundingText);
			/* The lastNotification prevents repetitive notifications because
			 * of constant updates.
			 */
			if (matched && surroundingText !== lastNotification) {
				new Notification("Match found", {body: surroundingText});
				lastNotification = surroundingText;
			}
		})
}

/* The script gets injected when the "Ask to join" page. However, captions
 * element isn't shown until you actually join the meeting, so a 0.5s loop lets
 * us add a listener whenever it shows up.
 */
function setupListener() {
	const captionElement = document.querySelector(".a4cQT");
	if (captionElement === null) {
		setTimeout(setupListener, 500);
		return;
	}
	const config = { subtree: true, childList: true };
	const observer = new MutationObserver(captionUpdate);
	observer.observe(captionElement, config);
}

setupListener();
