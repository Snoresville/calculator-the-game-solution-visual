import { Button } from "./button";
import { CalculatorState } from "./types";
import { extractSign } from "./utils";

function add(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: state.value + (n + state.operationModifier),
            };
        },
        (state) => `+${n + state.operationModifier}`
    );
}

function subtract(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: state.value - (n + state.operationModifier),
            };
        },
        (state) => `-${n + state.operationModifier}`
    );
}

function multiply(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: state.value * (n + state.operationModifier),
            };
        },
        (state) => `x${n + state.operationModifier}`
    );
}

function divide(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: state.value / (n + state.operationModifier),
            };
        },
        (state) => `/${n + state.operationModifier}`
    );
}

function deleteRight() {
    return new Button(
        (state: CalculatorState) => {
            const sign = extractSign(state.value);
            const value = Math.abs(state.value);

            return {
                ...state,
                value: sign * Number(value.toString().slice(0, -1)),
            };
        },
        () => `<<`
    );
}

function leftShift() {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: state.value * 10,
            };
        },
        () => `>>`
    );
}

function insertRight(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: Number(
                    state.value.toString() +
                        (n + state.operationModifier).toString()
                ),
            };
        },
        (state) => `${n + state.operationModifier}`
    );
}

function replace(before: number | string, after: number | string) {
    return new Button(
        (state: CalculatorState) => {
            const regex = new RegExp(`${before}`, "g");
            return {
                ...state,
                value: Number(
                    state.value.toString().replace(regex, after.toString())
                ),
            };
        },
        () => `${before}=>${after}`
    );
}

function exponent(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: Math.pow(state.value, n + state.operationModifier),
            };
        },
        (state) => `x^${n + state.operationModifier}`
    );
}

function negate() {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                value: -state.value,
            };
        },
        () => `+/-`
    );
}

function reverse() {
    return new Button(
        (state: CalculatorState) => {
            const sign = extractSign(state.value);
            const value = Math.abs(state.value);

            return {
                ...state,
                value:
                    sign *
                    Number(value.toString().split("").reverse().join("")),
            };
        },
        () => `REVERSE`
    );
}

function sumDigits() {
    return new Button(
        (state: CalculatorState) => {
            if (state.value % 1 != 0) {
                return {
                    ...state,
                    value: Number.NaN,
                };
            }
            const sign = extractSign(state.value);
            let value = Math.abs(state.value);

            let sum = 0;
            while (value > 0) {
                sum += value % 10;
                value = (value - (value % 10)) / 10;
            }
            return {
                ...state,
                value: sign * sum,
            };
        },
        () => `SUM`
    );
}

function cycleLeft() {
    return new Button(
        (state: CalculatorState) => {
            const sign = extractSign(state.value);
            const value = Math.abs(state.value);

            const valueString = value.toString();
            if (valueString.length < 2) {
                return {
                    ...state,
                    value: state.value,
                };
            }

            return {
                ...state,
                value: sign * Number(valueString.slice(1) + valueString[0]),
            };
        },
        () => `<-`
    );
}

function cycleRight() {
    return new Button(
        (state: CalculatorState) => {
            const sign = extractSign(state.value);
            const value = Math.abs(state.value);

            const valueString = value.toString();
            if (valueString.length < 2) {
                return { ...state, value: state.value };
            }

            return {
                ...state,
                value:
                    sign *
                    Number(
                        valueString[valueString.length - 1] +
                            valueString.slice(0, -1)
                    ),
            };
        },
        () => `->`
    );
}

function mirror() {
    return new Button(
        (state: CalculatorState) => {
            const sign = extractSign(state.value);
            const value = Math.abs(state.value);

            return {
                ...state,
                value:
                    sign *
                    Number(
                        value.toString() +
                            value.toString().split("").reverse().join("")
                    ),
            };
        },
        () => `MIRROR`
    );
}

function addButtonValue(n: number) {
    return new Button(
        (state: CalculatorState) => {
            return {
                ...state,
                operationModifier: state.operationModifier + n,
            };
        },
        () => `[+]${n}`
    );
}

function store() {
    return [
        // Store value into the store
        new Button(
            (state: CalculatorState) => {
                return {
                    ...state,
                    stored: state.value >= 0 ? state.value : null,
                };
            },
            (state) => `STORE ${state.value}`
        ),

        // Similar to insertRight, with usage of stored value
        new Button(
            (state: CalculatorState) => {
                if (state.stored) {
                    return {
                        ...state,
                        value: Number(
                            state.value.toString() + state.stored.toString()
                        ),
                    };
                }

                return {
                    ...state,
                };
            },
            (state) => `${state.stored} (STORE)`
        ),
    ];
}

function inv10() {
    return new Button(
        (state: CalculatorState) => {
            const sign = extractSign(state.value);
            const value = Math.abs(state.value);

            let result = "";
            for (const d of value.toString()) {
                const digit = Number(d);
                if (digit > 0) {
                    result += (10 - digit).toString();
                } else {
                    result += digit.toString();
                }
            }
            return {
                ...state,
                value: sign * Number(result),
            };
        },
        () => `INV10`
    );
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
    addButtonValue,
    store,
    inv10,
};
