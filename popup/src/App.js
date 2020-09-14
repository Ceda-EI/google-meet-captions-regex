/* global browser */
import React, { useState, useEffect } from "react";
import {
	createMuiTheme,
	Chip,
	IconButton,
	Input,
	Switch,
	ThemeProvider,
	Typography
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import "./App.css";

function App() {
	const [ advanced, setAdvanced ] = useState(undefined);
	const [ words, setWords ] = useState(undefined);
	const [ word, setWord ] = useState("");
	const [ regex, setRegex ] = useState(undefined);
	const [ flags, setFlags ] = useState(undefined);
	const [ darkMode, setDarkMode ] = useState(undefined);
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
			flags: [ setFlags, "" ],
			darkMode: [setDarkMode, false]
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
	useEffect(() => {
		browser.storage.local.get("darkMode")
			.then(() => {
				if (darkMode === undefined)
					return;
				browser.storage.local.set({ darkMode });
				document.querySelector("body").style.backgroundColor = darkMode ? "#424242" : "#FFFFFF";
			});
	}, [darkMode]);
	// Show Loading till all values are synced from storage to state
	if ([advanced, words, regex, flags, darkMode].map(i => i === undefined).reduce((i, j) => i || j))
		return <div>Loading</div>;

	const theme = createMuiTheme({
		palette: {
			type: darkMode ? "dark": "light",
		}
	});
	return (
		<ThemeProvider theme={theme}>
			<div className="toggle">
				<label forName="toggle">
					<Typography variant="body1" color="textPrimary">
						Advanced Mode
					</Typography>
				</label>
				<Switch
					id="toggle"
					onChange={e => setAdvanced(e.target.checked)}
					checked={advanced}
					color="primary"
				/>
			</div>
			<div className="toggle">
				<label forName="toggle-dark">
					<Typography variant="body1" color="textPrimary">
						Dark Mode
					</Typography>
				</label>
				<Switch
					id="toggle-dark"
					onChange={e => setDarkMode(e.target.checked)}
					checked={darkMode}
					color="primary"
				/>
			</div>
			<div className="simple"
				style={{
					display: advanced ? "none": "block"
				}}
			>
				<div className="words">
					{words.map((word, idx) =>
						<Chip
							label={word}
							className="word"
							key={idx}
							onDelete={() => (removeWord(idx))}
						/>
					)}
				</div>
				<form>
					<div className="word-input">
						<Input
							id="add-word"
							type="text"
							value={word}
							onInput={e => setWord(e.target.value)}
							placeholder="Enter phrase to match and send notification"
							style={{
								flexGrow: 1,
							}}
						/>
						<IconButton
							id="add-word-button"
							onClick={e => {setWords([...words, word]); setWord(""); e.preventDefault();}}
							type="submit"
							disabled={word === ""}
							color="primary"
							variant="contained"
						>
							<Add />
						</IconButton>
					</div>
				</form>
			</div>
			<div className="advanced"
				style={{
					display: advanced ? "flex": "none",
				}}
			>
				<Typography variant="body1" color="textPrimary">/</Typography>
				<Input
					id="add-regex"
					type="text"
					value={regex}
					onInput={e => setRegex(e.target.value)}
					placeholder="RegEx"
					style={{
						width: "85%"
					}}
				/>
				<Typography variant="body1" color="textPrimary">/</Typography>
				<Input
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
		</ThemeProvider>
	);
}

export default App;
