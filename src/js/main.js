import './../scss/style.scss';
import './../Songliste.html';

const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById('tableBody');
const table = document.querySelector('.list');

let timer = 0;
searchInput.addEventListener('input', () => {
	window.clearTimeout(timer);
	timer = setTimeout(function () {
		const searchTerm = searchInput.value.toLowerCase().split(' ');
		const rows = tableBody.querySelectorAll('tr');

		rows.forEach((row) => {
			if (!row.cells[1]) return;
			const foundData = [...row.cells].find((cell) => {
				const cellContent = cell.textContent.toLowerCase();
				return searchTerm.some((substrings) => {
					highlightText(cell, substrings);
					return cellContent.includes(substrings);
				});
			});
			if (foundData) {
				row.style.display = '';
			} else {
				row.style.display = 'none';
			}
		});
	}, 750);
});

function highlightText(element, searchTerm) {
	const text = element.textContent;
	const startIndex = text.toLowerCase().indexOf(searchTerm);

	// first clearing up
	element.innerHTML = text;

	// insert mark element for hightlighting
	if (startIndex !== -1 && searchTerm.length > 1) {
		const matchedText = text.substr(startIndex, searchTerm.length);
		const highlighted = text.replace(new RegExp(matchedText, 'gi'), '<mark>' + matchedText + '</mark>');
		element.innerHTML = highlighted;
	}
}

function createHeadlinesAndCharacterButtons(extractedTBody) {
	let lastUniqueChar = null;
	let anchors = [];
	extractedTBody.querySelectorAll('tr').forEach((row) => {
		const firstLetter = row.cells[1].textContent.toLowerCase().substring(0, 1);

		if (isNaN(firstLetter) && lastUniqueChar != firstLetter) {
			lastUniqueChar = firstLetter;
			anchors.push(firstLetter);
			row.insertAdjacentHTML(
				'beforebegin',
				`<tr id="${firstLetter.toLocaleUpperCase()}" class="heading"><span>${firstLetter.toLocaleUpperCase()}</span></tr>`
			);
		} else if (!isNaN(firstLetter) && lastUniqueChar == null) {
			lastUniqueChar = firstLetter;
			anchors.push('0-9');
			row.insertAdjacentHTML('beforebegin', `<tr id="0-9" class="heading"><span>0-9</span></tr>`);
		}
	});

	const anchorBox = document.querySelector('.anchors');
	anchors.forEach((btn) => {
		anchorBox.insertAdjacentHTML(
			'beforeend',
			`<a class="button" href="#${btn.toLocaleUpperCase()}">${btn.toLocaleUpperCase()}</a>`
		);
	});
}

// Fetch the content of the local HTML file and extract the tbody
fetch('Songliste.html')
	.then((response) => response.text())
	.then((html) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const extractedTBody = doc.querySelector('tbody');

		createHeadlinesAndCharacterButtons(extractedTBody);

		tableBody.innerHTML = extractedTBody.innerHTML;
	});
