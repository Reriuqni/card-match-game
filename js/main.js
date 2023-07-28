const selectorTilesContainer = '.tiles'
let game = startNewGame()

const gameContainer = document.querySelector('.game-container');
gameContainer.addEventListener('mouseenter', () => game.resume()); //mouseover, mousedown, mousemove
gameContainer.addEventListener('mouseleave', () => game.pause()); //mouseout, mouseup

function startNewGame() {
    const {
        genNnumberOfColumns,
        genNumberOfRows,
    } = generateMockData()

    document.querySelector(selectorTilesContainer).innerHTML = ''

    return new MatchGrid({
        widthPX: '40px',
        heightPX: '40px',
        // numberOfColumns: 3,
        // numberOfRows: 3,
        numberOfColumns: genNnumberOfColumns,  // Mock: random
        numberOfRows: genNumberOfRows,         // Mock: random
        tilesGap: '12px',
        timeLimitSeconds: 1000,                // the time of game in seconds
        timeIntervalHideNotMatchedGrid: 1000,  // miliseconds to hide two not matched tiles
        selectorTilesContainer
        // theme(colors, font, etc.)
    });
}

function generateMockData() {
    const minТumberOfColumns = 2
    const randomNumberOfColumns = 15
    const genNnumberOfColumns = Math.floor(Math.random() * randomNumberOfColumns) + minТumberOfColumns

    // Genarate random number rows
    const minNumberOfRows = 2
    const randomNumberOfRows = 4
    const genNumberOfRows = Math.floor(Math.random() * randomNumberOfRows) + minNumberOfRows

    console.log('Mock:NnumberOfColumns', genNnumberOfColumns)
    console.log('Mock:NumberOfRows', genNumberOfRows)

    return {
        genNnumberOfColumns,
        genNumberOfRows,
    }
}


