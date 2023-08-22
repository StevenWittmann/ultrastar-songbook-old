import './../scss/style.scss';
import './../Songliste.html';

const searchInput = document.getElementById('searchInput');
const tableBody = document.getElementById('tableBody');
const table = document.querySelector('.list');

searchInput.addEventListener('input', () => {
	const searchTerm = searchInput.value.toLowerCase();
	const rows = tableBody.querySelectorAll('tr');

	rows.forEach((row) => {
		const artist = row.cells[1].textContent.toLowerCase();
		const track = row.cells[2].textContent.toLowerCase();

		if (artist.includes(searchTerm) || track.includes(searchTerm)) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
});

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
