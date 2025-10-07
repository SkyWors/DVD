const container = document.querySelector(".container");

let windowHeight = container.clientHeight;
let windowWidth = container.clientWidth;

const maxTries = 100;

let dvdNumber = 1;
let speed = 2;
let dvdWidth = 400;
let dvdHeight = dvdWidth / 2;
const colors = ["red", "blue", "green", "purple", "orange", "magenta", "lime"];

let bounceCount = 0;
displayStats();

let allDvdContainersPositions = [];

for (let i = 1; i <= dvdNumber; i++) {
	addDvd();
}

function displayStats() {
	const statContainer = document.createElement("div");
	statContainer.classList.add("stat_container");

	const dvdCountDisplay = document.createElement("p");
	dvdCountDisplay.id = "dvd_count_display";

	const bounceCountDisplay = document.createElement("p");
	bounceCountDisplay.id = "bounce_count_display";

	const addDvdButton = document.createElement("button");
	addDvdButton.textContent = "Add DVD";
	addDvdButton.addEventListener("click", () => {
		addDvd();
		dvdNumber++;
	});

	const removeDvdButton = document.createElement("button");
	removeDvdButton.id = "remove_dvd_button";
	removeDvdButton.textContent = "Remove DVD";
	removeDvdButton.addEventListener("click", removeDvd)

	const speedSlider = document.createElement("input");
	speedSlider.type = "range";
	speedSlider.min = 1;
	speedSlider.max = 50;
	speedSlider.value = speed;
	speedSlider.title = "Speed";
	speedSlider.addEventListener("input", (el) => {
		speed = el.target.value;
	});

	const widthSlider = document.createElement("input");
	widthSlider.type = "range";
	widthSlider.min = 1;
	widthSlider.max = windowWidth /2;
	widthSlider.value = dvdWidth;
	widthSlider.title = "Width";
	widthSlider.addEventListener("input", (el) => {
		dvdWidth = el.target.value *1;
		document.querySelectorAll(".dvd_container").forEach(dvd => {
			dvd.style.width = `${dvdWidth}px`;
		});
	});

	const heightSlider = document.createElement("input");
	heightSlider.type = "range";
	heightSlider.min = 1;
	heightSlider.max = windowHeight /2;
	heightSlider.value = dvdHeight;
	heightSlider.title = "Height";
	heightSlider.addEventListener("input", (el) => {
		dvdHeight = el.target.value *1;
		document.querySelectorAll(".dvd_container").forEach(dvd => {
			dvd.style.height = `${dvdHeight}px`;
		});
	});

	statContainer.appendChild(dvdCountDisplay);
	statContainer.appendChild(bounceCountDisplay);
	statContainer.appendChild(addDvdButton);
	statContainer.appendChild(removeDvdButton);
	statContainer.appendChild(speedSlider);
	statContainer.appendChild(widthSlider);
	statContainer.appendChild(heightSlider);

	container.appendChild(statContainer);
}

function addDvd() {
	const newDvdContainer = document.createElement("img");
	newDvdContainer.src = "dvd.svg";
	newDvdContainer.classList.add("dvd_container");
	newDvdContainer.dataset.id = document.querySelectorAll(".dvd_container").length;
	newDvdContainer.style.width = `${dvdWidth}px`;
	newDvdContainer.style.height = `${dvdHeight}px`;

	container.appendChild(newDvdContainer);
	updateDvdColor(newDvdContainer);
	bounceCount--;

	let x, y;
	let tries = 0;
	do {
		x = Math.floor(Math.random() * (windowWidth - dvdWidth));
		y = Math.floor(Math.random() * (windowHeight - dvdHeight));
		tries++;
		if (tries > maxTries) {
			console.warn("Max tries reached while placing a new DVD. Some DVDs may overlap.");
			newDvdContainer.remove();
			return;
		}
	} while (allDvdContainersPositions.some(pos =>
		pos
		&& x < pos.x + dvdWidth
		&& x + dvdWidth > pos.x
		&& y < pos.y + dvdHeight
		&& y + dvdHeight > pos.y
	));

	let vx = 2 * Math.round(Math.random()) -1;
	let vy = 2 * Math.round(Math.random()) -1;

	allDvdContainersPositions[newDvdContainer.dataset.id] = {x, y, vx, vy};

	window.requestAnimationFrame(() => {bounce(newDvdContainer);});
}

function removeDvd() {
	allDvdContainersPositions.pop();
	const dvd = document.querySelector(".dvd_container:last-of-type");
	dvd.remove();
	dvdNumber--;
}

function updateDvdColor(el) {
	const randomColor = colors[Math.floor(Math.random() * colors.length)];

	const filterMap = {
		"red": "hue-rotate(0deg) saturate(2)",
		"blue": "hue-rotate(240deg) saturate(2)",
		"green": "hue-rotate(120deg) saturate(2)",
		"purple": "hue-rotate(270deg) saturate(2)",
		"orange": "hue-rotate(30deg) saturate(2)",
		"magenta": "hue-rotate(300deg) saturate(2)",
		"lime": "hue-rotate(90deg) saturate(2)"
	};

	el.style.filter = filterMap[randomColor];
	bounceCount++;
}

function bounce(el) {
	try {
		document.getElementById("dvd_count_display").textContent = `DVDs: ${dvdNumber}`;
		document.getElementById("bounce_count_display").textContent = `Bounces: ${bounceCount}`;

		if (dvdNumber == 0) {
			document.getElementById("remove_dvd_button").disabled = true;
		} else {
			document.getElementById("remove_dvd_button").disabled = false;
		}

		let elData = allDvdContainersPositions[el.dataset.id];
		let x = elData.x;
		let y = elData.y;
		let vx = elData.vx;
		let vy = elData.vy;

		if ((elData.x + dvdWidth >= windowWidth) || (x <= 0)) {
			vx = -vx;
			updateDvdColor(el);
		}
		if ((y + dvdHeight >= windowHeight) || (y <= 0)) {
			vy = -vy;
			updateDvdColor(el);
		}

		document.querySelectorAll(".dvd_container").forEach((element) => {
			if (element !== el) {
				const otherId = element.dataset.id;
				const otherPos = allDvdContainersPositions[otherId];

				if (
					otherPos
					&& x < otherPos.x + dvdWidth
					&& x + dvdWidth > otherPos.x
					&& y < otherPos.y + dvdHeight
					&& y + dvdHeight > otherPos.y
				) {
					vx = -otherPos.vx * vx;
					vy = -otherPos.vy * vy;

					updateDvdColor(el);
				}
			}
		});

		x += vx * speed;
		y += vy * speed;

		allDvdContainersPositions[el.dataset.id] = {x, y, vx, vy};
		el.style.left = `${x}px`;
		el.style.top = `${y}px`;

		window.requestAnimationFrame(() => {bounce(el);});
	} catch (error) {}
}
