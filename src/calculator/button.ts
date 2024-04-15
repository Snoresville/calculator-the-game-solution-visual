import { CalculatorState } from "./types";

export class Button {
    private evalFunc: (state: CalculatorState) => CalculatorState;
    private labelFunc: (state: CalculatorState) => string;

    constructor(
        transformationFunc: (state: CalculatorState) => CalculatorState,
        label: (state: CalculatorState) => string
    ) {
        this.evalFunc = transformationFunc;
        this.labelFunc = label;
    }

    eval(state: CalculatorState) {
        return this.evalFunc ? this.evalFunc(state) : state;
    }

    getLabel(state: CalculatorState) {
        return this.labelFunc(state);
    }
}
