import { Button } from "./button";
import { extractSign } from "./utils";

function add(n: number) {
    return new Button((value: number) => {
        return value + n;
    }, `+${n}`);
}

function subtract(n: number) {
    return new Button((value: number) => {
        return value - n;
    }, `-${n}`);
}

function multiply(n: number) {
    return new Button((value: number) => {
        return value * n;
    }, `x${n}`);
}

function divide(n: number) {
    return new Button((value: number) => {
        return value / n;
    }, `/${n}`);
}

function deleteRight() {
    return new Button((value: number) => {
        const sign = extractSign(value);
        value = Math.abs(value);

        return sign * Number(value.toString().slice(0, -1));
    }, `<<`);
}

function leftShift() {
    return new Button((value: number) => {
        return value * 10;
    }, `>>`);
}

function insertRight(n: number) {
    return new Button((value: number) => {
        return Number(value.toString() + n.toString());
    }, `${n}`);
}

function replace(before: number, after: number) {
    return new Button((value: number) => {
        const regex = new RegExp(`${before}`, "g");
        return Number(value.toString().replace(regex, after.toString()));
    }, `${before}=>${after}`);
}

function exponent(n: number) {
    return new Button((value: number) => {
        return Math.pow(value, n);
    }, `x^${n}`);
}

function negate() {
    return new Button((value: number) => {
        return -value;
    }, `+/-`);
}

function reverse() {
    return new Button((value: number) => {
        const sign = extractSign(value);
        value = Math.abs(value);

        return sign * Number(value.toString().split("").reverse().join(""));
    }, `REVERSE`);
}

function sumDigits() {
    return new Button((value: number) => {
        if (value % 1 != 0) {
            return Number.NaN;
        }
        const sign = extractSign(value);
        value = Math.abs(value);

        let sum = 0;
        while (value > 0) {
            sum += value % 10;
            value = (value - (value % 10)) / 10;
        }
        return sign * sum;
    }, `SUM`);
}

function cycleLeft() {
    return new Button((value: number) => {
        const sign = extractSign(value);
        value = Math.abs(value);

        const valueString = value.toString();
        if (valueString.length < 2) {
            return value;
        }

        return sign * Number(valueString.slice(1) + valueString[0]);
    }, `<-`);
}

function cycleRight() {
    return new Button((value: number) => {
        const sign = extractSign(value);
        value = Math.abs(value);

        const valueString = value.toString();
        if (valueString.length < 2) {
            return value;
        }

        return (
            sign *
            Number(
                valueString[valueString.length - 1] + valueString.slice(0, -1)
            )
        );
    }, `->`);
}

function mirror() {
    return new Button((value: number) => {
        const sign = extractSign(value);
        value = Math.abs(value);

        return (
            sign *
            Number(
                value.toString() + value.toString().split("").reverse().join("")
            )
        );
    }, `MIRROR`);
}

export {
    add,
    subtract,
    multiply,
    divide,
    deleteRight,
    leftShift,
    insertRight,
    replace,
    exponent,
    negate,
    reverse,
    sumDigits,
    cycleLeft,
    cycleRight,
    mirror,
};
