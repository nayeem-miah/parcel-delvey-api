
export const calculateFrr = (width: number) => {
    const widthPerKg = 5
    return Math.ceil(width) * widthPerKg
}