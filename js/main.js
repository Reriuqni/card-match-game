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

new MatchGrid({
    widthPX: '40px',
    heightPX: '60px',
    numberOfColumns: genNnumberOfColumns,
    numberOfRows: genNumberOfRows,
    timeLimitSeconds: 30,
    // selectorTilesContainer
    // theme(colors, font, etc.)
});
