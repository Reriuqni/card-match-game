function getColors({ qtyColors }) {
    const randomColorList = getListOfHEX(qtyColors)
    const uniqColorList = removeDublicateAndFill(randomColorList)

    return uniqColorList

    // Impl
    // Impl
    // Impl

    function generateHEXColor() {
        return '#' +
            Math
                .floor(Math.random() * 2 ** 24)
                .toString(16)
                .padStart(6, "0")
    }

    function getListOfHEX(length) {
        return Array.from({ length }, () => generateHEXColor())
    }

    function removeDublicateAndFill(colors) {
        const set = new Set(colors)
        while (set.size < colors.length) {
            set.add(generateHEXColor());
        }
        return Array.from(set)
    }
}
