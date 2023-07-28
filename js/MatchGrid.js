const GAME_NOT_STARTED = 0;
const GAME_IS_OVER_YOU_LOOSE = 1;
const GAME_IS_OVER_YOU_WIN = 2
const GAME_IS_PLAYING = 3;
const GAME_PAUSED = 4;

// Selectors
const ID_BTN_START_GAME = 'btn-start';
const ID_BTN_PAUSE_GAME = 'btn-pause';
const ID_BTN_RESUME_GAME = 'btn-resume';


class MatchGrid {
    constructor({
        widthPX = '50px',
        heightPX = '50px',
        numberOfColumns,
        numberOfRows,
        timeLimitSeconds,
        tilesGap = '16px',
        selectorTilesContainer,
        timeIntervalHideNotMatchedGrid
        // theme(colors, font, etc.)
    } = {}) {
        this.tilesGap = tilesGap
        this.tileWidth = widthPX
        this.tileHeight = heightPX
        // setTileSizeByMeasuresTilesContainer({ width: widthPX, height: heightPX })

        this.numberOfColumns = numberOfColumns
        this.numberOfRows = numberOfRows
        this.timeLimitSeconds = timeLimitSeconds
        this.timeIntervalHideNotMatchedGrid = timeIntervalHideNotMatchedGrid
        this.selectorTilesContainer = selectorTilesContainer

        const colors = getColors({ qtyColors: numberOfColumns * numberOfRows / 2 });
        const colorsWithNum = colors.map((color, idx) => { return { number: idx, color } });
        this.colorsPicklist = [...colorsWithNum, ...colorsWithNum];
        this.tileCount = this.colorsPicklist.length;

        this.revealedCount = 0;
        this.activeTile = null;
        this.awaitingEndOfMove = false;

        // 0 - GAME_NOT_STARTED
        // 1 - game is over, you loose
        // 2 - you win the game
        // 3 - the game paused
        // 4 - GAME_PAUSED
        this.gameStatus = GAME_NOT_STARTED

        this.init()
    }

    static {
        this.tileClassName = "tile"
    }

    init() {
        if (this.checkMinRequirements()) {
            this.showInfo({ msg: "Press 'Start'" })
            this.setTileSize()
            this.BuildTiles()
            this.tilesHydrate()
            this.initTimer()
        }
    }

    /**
     * In case when the params widthPX and heightPX is the width and height block of tiles.
     * @param {*} width - width of the Tiles container in px 
     * @param {*} width - height of the Tiles container in px 
     */
    setTileSizeByMeasuresTilesContainer({ width, height }) {
        const widthPxToInt = parseInt(width)
        const heightPxToInt = parseInt(height)
        this.tileWidth = Math.floor(widthPxToInt / numberOfColumns) + 'px'
        this.tileHeight = Math.floor(heightPxToInt / numberOfRows) + 'px'
    }

    start() {
        this.gameStatus = GAME_IS_PLAYING
        document.getElementById(ID_BTN_START_GAME).disabled = true
        document.getElementById(ID_BTN_PAUSE_GAME).disabled = false
        this.hideInfo()
        this._timer.start()
    }

    pause() {
        if (this.gameStatus === GAME_IS_PLAYING) {
            this.gameStatus = GAME_PAUSED
            document.getElementById(ID_BTN_RESUME_GAME).disabled = false
            document.getElementById(ID_BTN_PAUSE_GAME).disabled = true
            this.showInfo({ msg: 'Pause' })
            this._timer.stop()
        }
    }

    resume() {
        if (this.gameStatus === GAME_PAUSED) {
            this.gameStatus = GAME_IS_PLAYING
            document.getElementById(ID_BTN_RESUME_GAME).disabled = true
            document.getElementById(ID_BTN_PAUSE_GAME).disabled = false
            this.hideInfo()
            this._timer.start()
        }
    }

    replay() {
        game = startNewGame()
        document.getElementById(ID_BTN_START_GAME).disabled = false
        document.getElementById(ID_BTN_PAUSE_GAME).disabled = true
        document.getElementById(ID_BTN_RESUME_GAME).disabled = true
    }

    stop() {
        this.#activityButtonsGroup_1_disabled()
        this._timer.reset(0)
        this.showInfo({ msg: 'Game Ended' })
    }

    showInfo({ msg }) {
        document.querySelector('.tiles--info').classList.add('show')
        document.querySelector('.tiles--info--message').innerHTML = msg
    }

    hideInfo() {
        document.querySelector('.tiles--info').classList.remove('show')
    }

    initTimer() {
        this._timer = new Timer({
            callback: (t) => this.gameIsOver(t),
            time: this.timeLimitSeconds,
            mode: 0,
        });
    }

    timer() {
        return this._timer
    }

    gameIsOver(time) {
        // The game not win yet and the time not over
        if (this.gameStatus != GAME_IS_OVER_YOU_WIN && time <= 0) {
            this.showInfo({ msg: 'Time is out. Game Over.' })
            this.gameStatus = GAME_IS_OVER_YOU_LOOSE;
            this.#activityButtonsGroup_1_disabled()
            this._timer.stop()
        }
    }

    #activityButtonsGroup_1_disabled() {
        document.getElementById(ID_BTN_START_GAME).disabled = true
        document.getElementById(ID_BTN_PAUSE_GAME).disabled = true
        document.getElementById(ID_BTN_RESUME_GAME).disabled = true
    }

    /**
     * 
     * @returns fasle if params not align minimum requirements, otherwise true
     */
    checkMinRequirements() {
        if (this.numberOfColumns < 1 || this.numberOfRows < 1) {
            alert('Game not started.\nNumber of Columns or number of Rows should be more then zero.')
            return false
        }
        return true
    }

    setTileSize() {
        const root = document.documentElement;
        root.style.setProperty('--tile-width', this.tileWidth);
        root.style.setProperty('--tile-height', this.tileHeight);
        root.style.setProperty('--tiles-gap', this.tilesGap);
        root.style.setProperty('--tiles--count-in-row', this.numberOfColumns);
    }

    BuildTiles() {
        for (let i = 0; i < this.tileCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.colorsPicklist.length);
            const colorAndNum = this.colorsPicklist[randomIndex];
            const tile = this.buildTile(colorAndNum);

            this.colorsPicklist.splice(randomIndex, 1);

            const tilesContainer = document.querySelector(this.selectorTilesContainer);
            tilesContainer.appendChild(tile);
        }
    }

    buildTile({ color, number }) {
        const element = document.createElement("div");
        element.innerHTML = `<span>${number}</span>`;
        element.classList.add("tile");
        element.setAttribute("data-color", color);
        element.setAttribute("data-revealed", "false");

        return element;
    }

    tilesHydrate() {
        const tiles = document.querySelectorAll('.' + MatchGrid.tileClassName);

        tiles.forEach(element =>
            element.addEventListener("click", () => {
                const color = element.getAttribute("data-color");

                if (this.gameStatus === GAME_NOT_STARTED) {
                    return;
                }
                if (this.gameStatus === GAME_IS_OVER_YOU_LOOSE) {
                    return;
                }
                if (this.gameStatus === GAME_PAUSED) {
                    return;
                }

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
                        this.gameStatus = GAME_IS_OVER_YOU_WIN
                        this._timer.stop();
                        this.showInfo({ msg: "You win!" })
                        this.#activityButtonsGroup_1_disabled()
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
                }, this.timeIntervalHideNotMatchedGrid);
            })
        )
    }

}
