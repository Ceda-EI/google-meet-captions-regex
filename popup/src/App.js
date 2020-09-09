/* global browser */
import React, { useState } from 'react';

function App() {
	const [ advanced, setAdvanced ] = useState(false);
	const [ words, setWords ] = useState([]);
	const [ word, setWord ] = useState("");
	const [ regex, setRegex ] = useState("");
	const [ flags, setFlags ] = useState("");
	function removeWord(idx) {
		setWords([...words.slice(0, idx), ...words.slice(idx+1)]);
	}
	return (
		<>
			<input
				type="checkbox"
				id="toggle"
				onChange={e => setAdvanced(e.target.checked)}
				checked={advanced}
			/>
			<label for="toggle">Advanced Mode</label>
			<div class="simple"
				style={{
					display: advanced ? "none": "block"
				}}
			>
				<div
					class="words"
					style={{
						display: "flex",
						flexWrap: "wrap",
						margin: "0.3em",
						width: "100%"
					}}
				>
					{words.map((word, idx) =>
						<span
							class="word"
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
							enabled={word !== ""}
						>
							+
						</button>
					</div>
				</form>
			</div>
			<div class="advanced"
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
