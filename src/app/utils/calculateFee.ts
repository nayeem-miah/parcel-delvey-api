
export const calculateFrr = (width: number) => {
    const widthPerKg = 2
    return Math.ceil(width) * widthPerKg
}