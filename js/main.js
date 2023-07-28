const selectorTilesContainer = '.tiles'
let game = startNewGame()

function startNewGame() {
    const {
        genNnumberOfColumns,
        genNumberOfRows,
    } = generateMockData()

    document.querySelector(selectorTilesContainer).innerHTML = ''

    return new MatchGrid({
        widthPX: '40px',
        heightPX: '60px',
        numberOfColumns: genNnumberOfColumns,
        numberOfRows: genNumberOfRows,
        timeLimitSeconds: 100,
        selectorTilesContainer
        // theme(colors, font, etc.)
    });
}

function generateMockData() {
    const minТumberOfColumns = 2
    const randomNumberOfColumns = 5
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
