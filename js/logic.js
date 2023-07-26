

const tilesContainer = document.querySelector(".tiles");

const maxX = 5
const maxY = 5

const xAxis = Math.floor(Math.random() * maxX)
const yAxis = Math.floor(Math.random() * maxY)
console.log(xAxis, yAxis)

setVariablesXY(xAxis)


const colors = getColors(xAxis, yAxis);
const colorsPicklist = [...colors, ...colors];
const tileCount = colorsPicklist.length;
console.log('colorsPicklist', colorsPicklist)
console.log(tileCount)

function setVariablesXY(maxX) {
    let root = document.documentElement;
    root.style.setProperty('--tiles--count-in-row', maxX);
}

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;

function buildTile(color) {
    const element = document.createElement("div");

    element.classList.add("tile");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");

        if (
            // Ознака, того, що таймер в одну секунду ще не завершився.
            // Всі кліки не обробляються
            awaitingEndOfMove
            || revealed === "true"
            // Клікнута картка та ж сама, що була відкрита на попередньому кроці
            || element == activeTile
        ) {
            return;
        }

        // Reveal this color
        element.style.backgroundColor = color;

        // Перший клік
        // Або перший клік після відкритої пари
        if (!activeTile) {
            activeTile = element;

            return;
        }

        const colorToMatch = activeTile.getAttribute("data-color");
        // Якщо поточний колір карти === попередньому кольору
        if (colorToMatch === color) {
            // Ознака, що картка відкрита і не буде надалі оброблятися
            element.setAttribute("data-revealed", "true");
            activeTile.setAttribute("data-revealed", "true");

            activeTile = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            if (revealedCount === tileCount) {
                alert("You win! Refresh to start again.");
            }

            return;
        }

        awaitingEndOfMove = true;

        // Дві картки кольорів не співпали
        setTimeout(() => {
            activeTile.style.backgroundColor = null;
            element.style.backgroundColor = null;

            awaitingEndOfMove = false;
            activeTile = null;
        }, 1000);
    });

    return element;
}

// Build up tiles
for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
    const color = colorsPicklist[randomIndex];
    const tile = buildTile(color);

    colorsPicklist.splice(randomIndex, 1);
    tilesContainer.appendChild(tile);
}