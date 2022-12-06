import { IngredientPrepareType } from "../../store/slices/cocktail/cocktail";

function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}
function rgbToHex(r: number, g: number, b: number) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function addVector(a: number[], b: number[]) {
    return a.map((e, i) => e + b[i]);
}

export function calculateABV(ingredientList: IngredientPrepareType[], unitList: string[]) {
    let abv = 0
    let amount = 0
    console.log(ingredientList, unitList)
    for (let i = 0; i < ingredientList.length; i++) {
        const ing_abv = ingredientList[i].ABV

        let ing_amount = Number(ingredientList[i].amount)
        if (!['ml', 'oz', 'gram'].includes(unitList[i]) || ingredientList[i].name == '얼음') {
            continue // ml, oz, gram이 아니거나 얼음인 경우 계산 X
        }

        else if (unitList[i] == 'oz')
            ing_amount *= 30


        abv += (ing_abv * ing_amount)
        amount += ing_amount
    }

    abv /= amount
    console.log("abv", abv)
    return Math.round(abv * 10) / 10
}
export function calculatePrice(ingredientList: IngredientPrepareType[], unitList: string[]) {
    let price = 0
    for (let i = 0; i < ingredientList.length; i++) {
        let ing_amount = Number(ingredientList[i].amount)
        let ing_price = Number(ingredientList[i].price)
        if (!['ml', 'oz',].includes(unitList[i]) && (ingredientList[i].unit.includes('개') || ingredientList[i].unit.includes('조각')))
            ing_price /= 100 // TODO : 단위 constraint
        if (unitList[i] == 'oz')
            ing_amount *= 30

        price = price + (ing_price * ing_amount)
    }
    return Math.round(price)

}
export function calculateColor(ingredientList: IngredientPrepareType[], unitList: string[]): string {
    let color = [0, 0, 0]
    let amount = 0

    for (let i = 0; i < ingredientList.length; i++) {
        let ing_amount = Number(ingredientList[i].amount)
        const ing_color: string = ingredientList[i].color
        if (['투명', '고체'].includes(ing_color))
            continue
        const ing_color_rgb = hexToRgb(ing_color)
        if (!ing_color_rgb)
            return ""

        if (unitList[i] == 'oz')
            ing_amount *= 30

        ing_color_rgb[0] *= ing_amount
        ing_color_rgb[1] *= ing_amount
        ing_color_rgb[2] *= ing_amount
        color = addVector(ing_color_rgb, color)
        amount += ing_amount
    }
    color[0] = Math.round(color[0] / amount)
    color[1] = Math.round(color[1] / amount)
    color[2] = Math.round(color[2] / amount)
    return rgbToHex(color[0], color[1], color[2])
}