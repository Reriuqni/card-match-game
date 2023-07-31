const GAME_NOT_STARTED = 0;
const GAME_IS_OVER_YOU_LOOSE = 1;
const GAME_IS_OVER_YOU_WIN = 2
const GAME_IS_PLAYING = 3;
const GAME_MANUAL_PAUSE = 4;
const GAME_AUTO_PAUSE = 5;

// Selectors
const ID_BTN_START_GAME = 'btn-start';
const ID_BTN_PAUSE_GAME = 'btn-pause';
const ID_BTN_RESUME_GAME = 'btn-resume';
const ID_BTN_END_GAME = 'btn-end';

const CSS_CLASS_HIDE = 'display-none';

const SELECTOR_TEXT_INFO = '.tiles--info--message';
const TILE_CLASS_NO_SHADOW = 'no-shadow';


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
            document.getElementById(ID_BTN_RESUME_GAME).classList.add(CSS_CLASS_HIDE)
            document.getElementById(ID_BTN_PAUSE_GAME).classList.add(CSS_CLASS_HIDE)
            document.getElementById(ID_BTN_START_GAME).classList.remove(CSS_CLASS_HIDE)
            document.getElementById(ID_BTN_END_GAME).classList.remove(CSS_CLASS_HIDE)
            this.initTimer()
        }
    }

    /**
     * In case when the params widthPX and heightPX is the width and height block of tiles
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
        document.querySelector(SELECTOR_TEXT_INFO).innerHTML = ''
        document.getElementById(ID_BTN_START_GAME).classList.add(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_PAUSE_GAME).classList.remove(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_END_GAME).classList.remove(CSS_CLASS_HIDE)
        this.hideInfo()
        this.initTimer()
        this._timer.start()
    }

    pause({ pauseType = GAME_MANUAL_PAUSE } = {}) {
        if (this.gameStatus === GAME_IS_PLAYING) {
            this.gameStatus = pauseType
            document.getElementById(ID_BTN_PAUSE_GAME).classList.add(CSS_CLASS_HIDE)
            document.getElementById(ID_BTN_START_GAME).classList.add(CSS_CLASS_HIDE)
            document.getElementById(ID_BTN_RESUME_GAME).classList.remove(CSS_CLASS_HIDE)
            this.showInfo({ msg: 'Pause' })
            this._timer.stop()
        }
    }

    pauseLeaveActivity() {
        if (this.gameStatus !== GAME_MANUAL_PAUSE) {
            this.pause({ pauseType: GAME_AUTO_PAUSE })
        }
    }

    resumeLeaveActivity() {
        if (this.gameStatus !== GAME_MANUAL_PAUSE) {
            this.resume()
        }
    }

    resume() {
        if (this.gameStatus === GAME_MANUAL_PAUSE || this.gameStatus === GAME_AUTO_PAUSE) {
            this.gameStatus = GAME_IS_PLAYING
            document.getElementById(ID_BTN_RESUME_GAME).classList.add(CSS_CLASS_HIDE)
            document.getElementById(ID_BTN_PAUSE_GAME).classList.remove(CSS_CLASS_HIDE)
            this.hideInfo()
            this._timer.start()
        }
    }

    replay() {
        this._timer.reset(0)
        game = startNewGame()
        document.getElementById(ID_BTN_PAUSE_GAME).classList.add(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_START_GAME).classList.remove(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_RESUME_GAME).classList.add(CSS_CLASS_HIDE)
    }

    stop() {
        this.#activityButtonsGroup_1_disabled()
        this._timer.reset(0)
        this.showInfo({ msg: 'Game Ended' })
    }

    getStatus() {
        return this.gameStatus;
    }
    setStatus(status) {
        this.gameStatus = status;
    }

    showInfo({ msg }) {
        document.querySelector('.tiles--info').classList.add('show')
        document.querySelector(SELECTOR_TEXT_INFO).innerHTML = msg
        this.animateTextInfo()
    }

    hideInfo() {
        document.querySelector('.tiles--info').classList.remove('show')
    }


    animateTextInfo() {
        const textEl = document.querySelector(SELECTOR_TEXT_INFO)
        textEl.innerHTML = textEl.textContent.replace(/\S/g, '<span>$&</span>')

        if (anime) {
            anime
                .timeline({
                    loop: true
                })
                .add({
                    targets: `${SELECTOR_TEXT_INFO} span`,
                    trannslateY: [-60, 0],
                    scale: [10, 1],
                    opacity: [0, 1],
                    easing: "easeOutExpo",
                    duration: 1500,
                    delay: anime.stagger(100),
                })
                .add({
                    targets: `${SELECTOR_TEXT_INFO} span`,
                    trannslateX: [0, 0],
                    scale: [1, 0],
                    opacity: [1, 1],
                    easing: "easeOutExpo",
                    duration: 2000,
                    delay: anime.stagger(100),
                })
        }
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
            this.showInfo({ msg: 'Time out' })
            this.gameStatus = GAME_IS_OVER_YOU_LOOSE;
            this.#activityButtonsGroup_1_disabled()
            this._timer.stop()
        }
    }

    #activityButtonsGroup_1_disabled() {
        document.getElementById(ID_BTN_PAUSE_GAME).classList.add(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_RESUME_GAME).classList.add(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_START_GAME).classList.remove(CSS_CLASS_HIDE)
        document.getElementById(ID_BTN_END_GAME).classList.add(CSS_CLASS_HIDE)
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

    animateTile({ target, color, borderRadius = ['0%', '50%'] } = {}) {
        if (anime) {
            anime({
                targets: target,
                backgroundColor: color,
                borderRadius: borderRadius,
                easing: 'easeInOutQuad',
                duration: 150
            });
        }
    }

    // logic of the Game
    // logic of the Game
    // logic of the Game
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
                if (this.gameStatus === GAME_MANUAL_PAUSE) {
                    return;
                }

                const revealed = element.getAttribute("data-revealed");

                if (
                    // A sign that the one-second timer has not yet expired. All clicks are not processed
                    this.awaitingEndOfMove
                    || revealed === "true"
                    // The card clicked is the same one that was opened in the previous step
                    || element == this.activeTile
                ) {
                    return;
                }

                // Reveal this color
                element.style.backgroundColor = color;
                element.classList.add(TILE_CLASS_NO_SHADOW)
                this.animateTile({ target: element, color })

                // The first click on the hide tile
                // Or the first click after revealed pair tiles 
                if (!this.activeTile) {
                    this.activeTile = element;

                    return;
                }

                const colorToMatch = this.activeTile.getAttribute("data-color");
                // If current map color === previous color
                if (colorToMatch === color) {
                    // A sign that the card is open and will not be processed further
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
                        document.getElementById(ID_BTN_START_GAME).classList.add(CSS_CLASS_HIDE)
                    }

                    return;
                }

                this.awaitingEndOfMove = true;

                // The colors of two open cards did not match
                setTimeout(() => {
                    this.activeTile.style.backgroundColor = null;
                    element.style.backgroundColor = null;
                    this.animateTile({ target: this.activeTile, color: null, borderRadius: ['50%', '4px'] })
                    this.animateTile({ target: element, color: null, borderRadius: ['50%', '4px'] })
                    this.activeTile.classList.remove(TILE_CLASS_NO_SHADOW)
                    element.classList.remove(TILE_CLASS_NO_SHADOW)

                    this.awaitingEndOfMove = false;
                    this.activeTile = null;
                }, this.timeIntervalHideNotMatchedGrid);
            })
        )
    }
    // logic of the Game
    // logic of the Game
    // logic of the Game
}
