function extractSign(value: number) {
    return value == 0 ? 0 : value / Math.abs(value)
}

export { extractSign }