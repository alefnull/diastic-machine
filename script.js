let example = document.getElementById('example');
let clear = document.getElementById('clear');
let input = document.getElementById('input');
let seed = document.getElementById('seed');
let submit = document.getElementById('submit');
let result = document.getElementById('result');

let seedText;
let inputFile = 'example.txt'

window.addEventListener('load', () => {
	// make sure all input elements are empty
	input.value = '';
	seed.value = '';
	result.innerHTML = '';
});

example.addEventListener('click', async () => {
	// load example input
	input.value = await loadData(inputFile);
	// load example seed
	seed.value = 'The quick brown fox jumps over the lazy dog.';
});

clear.addEventListener('click', () => {
	// clear input and seed
	input.value = '';
	seed.value = '';
	// clear result
	result.innerHTML = '';
	result.style.border = 'none';
});

submit.addEventListener('click', () => {
	let phrase = '';
	let matchingWords;
	seedText = seed.value.toLowerCase();
	// if seed is empty, alert the user
	if (seedText === '') {
		alert('please enter a seed phrase.');
	}

	// get text from 'input' element and split it into an array
	let rawData = input.value.toLowerCase();
	// if there is no input, alert the user
	if (rawData.length === 0) {
		alert('please enter some source text as input.');
		return;
	}
	// replace line feeds and carrige returns with spaces
	let formattedData = rawData.replace(/[\n\r]/g, ' ');
	// split the text into an array
	let dataArray = formattedData.split(' ');
	// for each entry in the array, strip non-letter characters
	dataArray = dataArray.map(strip);
	// split seedText into array of seed words, 'seedArray'
	const seedArray = seedText.split(' ');
	// iterate through seed words in 'seedArray'
	for (let i = 0; i < seedArray.length; i++) {
		// iterate through characters in current seed word
		for (let j = 0; j < seedArray[i].length; j++) {
			let char = seedArray[i][j];
			// if current character is not a letter, skip
			if (!isLetter(char)) {
				continue;
			}
			// search for all words that contain the current character at the same index as this one
			// and put them in a words array
			matchingWords = dataArray.filter(word => word.indexOf(char) === j);
			let wordSet = new Set(matchingWords);
			matchingWords = [...wordSet];
			// if there are no words that contain the current character, skip
			if (matchingWords.length === 0) {
				continue;
			}
			// pick a random word from the words array
			let chosenWord = matchingWords[Math.floor(Math.random() * matchingWords.length)];
			// console.log('chosen word is: ' + chosenWord);

			// remove all instances of chosen word from dataArray
			dataArray = dataArray.filter(word => word !== chosenWord);

			// if phrase is empty, add the current seed word
			// otherwise, add the current seed word after a space
			if (phrase === '') {
				phrase += strip(chosenWord);
			}
			else {
				phrase += ' ' + strip(chosenWord);
			}
			// console.log('current phrase:' + '"' + phrase + '"');
		}
	}
	// add endResult to result
	result.innerHTML = phrase;
	// if result's innerHTML is empty, disable border
	// if not empty, enable border
	if (result.innerHTML === '') {
		result.style.border = 'none';
	} else {
		result.style.border = '1px dotted #000';
	}
});

// isLetter function
function isLetter(char) {
	return /^[a-zA-Z]$/.test(char);
}

// strip non-letter characters from string
function strip(str) {
	return str.replace(/[^a-zA-Z]/g, '');
}

// loadData function
async function loadData(file) {
	const res = await fetch(file);
	const data = await res.text();
	return data;
}
