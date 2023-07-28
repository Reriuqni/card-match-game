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
        widthPX: '20px',
        heightPX: '24px',
        numberOfColumns: genNnumberOfColumns,
        numberOfRows: genNumberOfRows,
        // numberOfColumns: 16,
        // numberOfRows: 2,
        tilesGap: '12px',
        timeLimitSeconds: 100,
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


