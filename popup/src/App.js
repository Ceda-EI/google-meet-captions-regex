/* global browser */
import React, { useState, useEffect } from "react";

function App() {
	const [ advanced, setAdvanced ] = useState(undefined);
	const [ words, setWords ] = useState(undefined);
	const [ word, setWord ] = useState("");
	const [ regex, setRegex ] = useState(undefined);
	const [ flags, setFlags ] = useState(undefined);
	function removeWord(idx) {
		setWords([...words.slice(0, idx), ...words.slice(idx+1)]);
	}
	/*
	 * Get inital state from storage.
	 *
	 * setterDefaultValue is key: [setter, defaultValue] object where each
	 * setter sets the state while the defaultValue is set if the value is
	 * undefined
	 */
	useEffect(() => {
		const setterDefaultValue = {
			advanced: [ setAdvanced, false ],
			words: [ setWords, ["attendance", "roll number", "present"] ],
			regex: [ setRegex, "" ],
			flags: [ setFlags, "" ]
		};
		Object.keys(setterDefaultValue).forEach(key => {
			const [ setter, defaultValue ] = setterDefaultValue[key];
			browser.storage.local.get(key)
				.then(value => {
					if (key in value)
						setter(value[key]);
					else {

						browser.storage.local.set({ [key]: defaultValue });
						setter(defaultValue);

					}
				})
				.catch(() => {
					browser.storage.local.set({ [key]: defaultValue });
					setter(defaultValue);
				});
		});
	}, []);

	/* Sync state to storage
	 *
	 * For some reason browser.storage.local.set doesn't work unless I call it
	 * from the callback of browser.storage.local.get. Don't touch.
	 */
	useEffect(() => {
		browser.storage.local.get("regex")
			.then((() => regex !== undefined && browser.storage.local.set({ regex: regex })));
	}, [regex]);
	useEffect(() => {
		browser.storage.local.get("words")
			.then((() => words !== undefined && browser.storage.local.set({ words: words })));
	}, [words]);
	useEffect(() => {
		browser.storage.local.get("advanced")
			.then((() => advanced !== undefined && browser.storage.local.set({ advanced: advanced })));
	}, [advanced]);
	useEffect(() => {
		browser.storage.local.get("flags")
			.then((() => flags !== undefined && browser.storage.local.set({ flags: flags })));
	}, [flags]);
	// Show Loading till all values are synced from storage to state
	if ([advanced, words, regex, flags].map(i => i === undefined).reduce((i, j) => i || j))
		return <div>Loading</div>;
	return (
		<>
			<input
				type="checkbox"
				id="toggle"
				onChange={e => setAdvanced(e.target.checked)}
				checked={advanced}
			/>
			<label forName="toggle">Advanced Mode</label>
			<div className="simple"
				style={{
					display: advanced ? "none": "block"
				}}
			>
				<div
					className="words"
					style={{
						display: "flex",
						flexWrap: "wrap",
						margin: "0.3em",
						width: "100%"
					}}
				>
					{words.map((word, idx) =>
						<span
							className="word"
							key={idx}
							style={{
								backgroundColor: "#B4FFEF",
								borderRadius: "1em",
								padding: "0.25em 0.5em",
								margin: "0.1em"
							}}
						>
							{word}
							<span
								onClick={() => (removeWord(idx))}
								role="img"
								aria-label="Delete word"
								style={{
									cursor: "pointer"
								}}
							>
								✗
							</span>
						</span>
					)}
				</div>
				<form>
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyItems: "stretch"
						}}
					>
						<input
							id="add-word"
							type="text"
							value={word}
							onInput={e => setWord(e.target.value)}
							placeholder="Word"
							style={{
								flexGrow: 1,
							}}
						/>
						<button
							id="add-word-button"
							onClick={e => {setWords([...words, word]); setWord(""); e.preventDefault();}}
							type="submit"
							disabled={word === ""}
						>
							+
						</button>
					</div>
				</form>
			</div>
			<div className="advanced"
				style={{
					display: advanced ? "flex": "none",
					alignItems: "baseline",
					justifyItems: "space-between"
				}}
			>
				/
				<input
					id="add-regex"
					type="text"
					value={regex}
					onInput={e => setRegex(e.target.value)}
					placeholder="RegEx"
					style={{
						width: "85%"
					}}
				/>
				/
				<input
					id="add-flags"
					type="text"
					value={flags}
					onInput={e => setFlags(e.target.value)}
					placeholder="Flags"
					style={{
						width: "13%"
					}}
				/>
			</div>
		</>
	);
}

export default App;
