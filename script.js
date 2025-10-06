const dvdContainer = document.querySelector(".dvd_container");
const container = document.querySelector(".container");

let windowHeight = container.clientHeight;
let windowWidth = container.clientWidth;

const dvdContainerHeight = dvdContainer.clientHeight;
const dvdContainerWidth = dvdContainer.clientWidth;

const dvdNumber = 20;
const speed = 1;
const colors = ["red", "blue", "green", "purple", "orange", "magenta", "lime"];

for (let i = 1; i < dvdNumber; i++) {
	const newDvdContainer = dvdContainer.cloneNode(true);
	newDvdContainer.dataset.id = i;
	container.appendChild(newDvdContainer);
	updateDvdColor(newDvdContainer);
}

const allDvdContainers = document.querySelectorAll(".dvd_container");
let allDvdContainersPositions = [];

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
}

allDvdContainers.forEach((el) => {
	let x = Math.floor(Math.random() * (windowWidth - dvdContainerWidth));
	let y = Math.floor(Math.random() * (windowHeight - dvdContainerHeight));

	let vx = 2 * Math.round(Math.random()) -1;
	let vy = 2 * Math.round(Math.random()) -1;

	allDvdContainersPositions[el.dataset.id] = {x, y};

	function bounce() {
		if ((x + dvdContainerWidth >= windowWidth) || (x <= 0)) {
			vx = -vx;
			updateDvdColor(el);
		}
		if ((y + dvdContainerHeight >= windowHeight) || (y <= 0)) {
			vy = -vy;
			updateDvdColor(el);
		}

		if (x + dvdContainerWidth > windowWidth) {
			x = windowWidth - dvdContainerWidth;
		}
		if (y + dvdContainerHeight > windowHeight) {
			y = windowHeight - dvdContainerHeight;
		}

		allDvdContainers.forEach((element) => {
			if (element !== el) {
				const otherId = element.dataset.id;
				const otherPos = allDvdContainersPositions[otherId];

				if (
					otherPos
					&& x < otherPos.x + dvdContainerWidth
					&& x + dvdContainerWidth > otherPos.x
					&& y < otherPos.y + dvdContainerHeight
					&& y + dvdContainerHeight > otherPos.y
				) {
					vx = -vx;
					vy = -vy;

					updateDvdColor(el);
					updateDvdColor(element);
				}
			}
		});

		x += vx * speed;
		y += vy * speed;

		allDvdContainersPositions[el.dataset.id] = {x, y};
		el.style.left = `${x}px`;
		el.style.top = `${y}px`;

		window.requestAnimationFrame(bounce);
	}

	window.requestAnimationFrame(bounce);
});
