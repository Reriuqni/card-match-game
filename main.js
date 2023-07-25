const maxNumInRow = 100000
const tiles = document.querySelector('tiles')
const randomListLength = Math.floor(Math.random() * maxNumInRow)
// colors = getListOfRGB(randomListLength)
const colors = getListOfHEX(randomListLength)

const reFillColors = refillByRemovingDublicateColors(colors)

// function generateRGBColor() {
//     const r = Math.floor(Math.random() * 256);
//     const g = Math.floor(Math.random() * 256);
//     const b = Math.floor(Math.random() * 256);
//     return `rgb(${[r, g, b].join()})`
// }

// function getListOfRGB(length) {
//     return Array.from({ length }, () => generateRGBColor())
// }

function generateHEXColor() {
    return '#' + Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, "0")
}

function getListOfHEX(length) {
    return Array.from({ length }, () => generateHEXColor())
}

function refillByRemovingDublicateColors(colors) {
    const set = new Set(colors)
    let countRefill = 0

    while (set.size < colors.length) {
        set.add(generateHEXColor());
        countRefill++
    }

    if (countRefill) {
        console.log('refillByRemovingDublicateColors', countRefill)
    }

    return Array.from(set)

}

console.log('set === colors', reFillColors.length === colors.length)