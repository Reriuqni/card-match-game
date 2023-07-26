// Genarate random number columns
const minТumberOfColumns = 0
const randomNumberOfColumns = 5
const genNnumberOfColumns = Math.floor(Math.random() * randomNumberOfColumns) + minТumberOfColumns

// Genarate random number rows
const minNumberOfRows = 0
const randomNumberOfRows = 4
const genNumberOfRows = Math.floor(Math.random() * randomNumberOfRows) + minNumberOfRows

console.log('genNnumberOfColumns', genNnumberOfColumns)
console.log('genNumberOfRows', genNumberOfRows)

const selectorTilesContainer = '.tiles'

function startNewGame() {
    // Debug: mock data
    // Debug: mock data
    // Debug: mock data
    // Genarate random number columns
    const minТumberOfColumns = 1
    const randomNumberOfColumns = 5
    const genNnumberOfColumns = Math.floor(Math.random() * randomNumberOfColumns) + minТumberOfColumns

    // Genarate random number rows
    const minNumberOfRows = 1
    const randomNumberOfRows = 4
    const genNumberOfRows = Math.floor(Math.random() * randomNumberOfRows) + minNumberOfRows

    console.log('genNnumberOfColumns', genNnumberOfColumns)
    console.log('genNumberOfRows', genNumberOfRows)
    // Debug: mock data
    // Debug: mock data
    // Debug: mock data

    document.querySelector(selectorTilesContainer).innerHTML = ''

    new MatchGrid({
        widthPX: '40px',
        heightPX: '60px',
        numberOfColumns: genNnumberOfColumns,
        numberOfRows: genNumberOfRows,
        timeLimitSeconds: 30,
        selectorTilesContainer
        // theme(colors, font, etc.)
    });
}
