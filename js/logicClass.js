class MatchGrid {
    constructor({
        width = '100px',
        height = '100px',
        numberOfColumns,
        numberOfRows,
        timeLimitSeconds,
        selectorTilesContainer = '.tiles'
        // theme(colors, font, etc.)
    } = {}) {
        this.width = width
        this.height = height
        this.numberOfColumns = numberOfColumns
        this.numberOfRows = numberOfRows
        this.timeLimitSeconds = timeLimitSeconds
        this.selectorTilesContainer = selectorTilesContainer

        const widthNumber = parseInt(width)
        const heightNumber = parseInt(height)
        this.tileWidth = Math.floor(widthNumber / numberOfColumns) + 'px'
        this.tileHeight = Math.floor(heightNumber / numberOfRows) + 'px'

        const colors = getColors({ qtyColors: numberOfColumns * numberOfRows / 2 });
        this.colorsPicklist = [...colors, ...colors];
        this.tileCount = this.colorsPicklist.length;

        this.revealedCount = 0;
        this.activeTile = null;
        this.awaitingEndOfMove = false;

        this.init()
    }

    init() {
        this.setTileSize()
        this.BuildTiles()
    }

    checkMinRequirements() { }

    setTileSize() {
        const root = document.documentElement;
        root.style.setProperty('--tile-width', this.tileWidth);
        root.style.setProperty('--tile-height', this.tileHeight);
        root.style.setProperty('--tiles--count-in-row', this.numberOfRows);
    }

    BuildTiles() {
        for (let i = 0; i < this.tileCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.colorsPicklist.length);
            const color = this.colorsPicklist[randomIndex];
            const tile = this.buildTile(color);

            this.colorsPicklist.splice(randomIndex, 1);

            const tilesContainer = document.querySelector(this.selectorTilesContainer);
            tilesContainer.appendChild(tile);
        }
    }

    buildTile(color) {
        const element = document.createElement("div");

        element.classList.add("tile");
        element.setAttribute("data-color", color);
        element.setAttribute("data-revealed", "false");

        element.addEventListener("click", () => {
            const revealed = element.getAttribute("data-revealed");

            if (
                // Ознака, того, що таймер в одну секунду ще не завершився.
                // Всі кліки не обробляються
                this.awaitingEndOfMove
                || revealed === "true"
                // Клікнута картка та ж сама, що була відкрита на попередньому кроці
                || element == this.activeTile
            ) {
                return;
            }

            // Reveal this color
            element.style.backgroundColor = color;

            // Перший клік
            // Або перший клік після відкритої пари
            if (!this.activeTile) {
                this.activeTile = element;

                return;
            }

            const colorToMatch = this.activeTile.getAttribute("data-color");
            // Якщо поточний колір карти === попередньому кольору
            if (colorToMatch === color) {
                // Ознака, що картка відкрита і не буде надалі оброблятися
                element.setAttribute("data-revealed", "true");
                this.activeTile.setAttribute("data-revealed", "true");

                this.activeTile = null;
                this.awaitingEndOfMove = false;
                this.revealedCount += 2;

                if (this.revealedCount === this.tileCount) {
                    alert("You win! Refresh to start again.");
                }

                return;
            }

            this.awaitingEndOfMove = true;

            // Дві картки кольорів не співпали
            setTimeout(() => {
                this.activeTile.style.backgroundColor = null;
                element.style.backgroundColor = null;

                this.awaitingEndOfMove = false;
                this.activeTile = null;
            }, 1000);
        });

        return element;
    }

}
