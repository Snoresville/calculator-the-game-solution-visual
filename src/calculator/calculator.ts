import { Button } from "./button";
import { INITIAL_STATE } from "./constants";
import { CalculatorInitProps, CalculatorState } from "./types";
import { extractSign } from "./utils";

export class Calculator {
    buttons: Button[] = [];
    portalPos?: [number, number];

    // For calculation
    private depthStack: CalculatorState[] = [];
    private depthResult: CalculatorState[][] = [];
    private goal: number = 0;

    constructor(props: CalculatorInitProps) {
        this.buttons = props.buttons ?? [];
        this.portalPos = props.portalPos;
    }

    calculate(initial: number, goal: number, moves: number = 100) {
        this.goal = goal;
        this.depthStack = [
            {
                ...INITIAL_STATE,
                value: initial,
            },
        ];
        this.depthResult = [];

        this.depthCalculate(this.depthStack[0], moves);

        return this.depthResult;
    }

    private validateDepthPath(current: CalculatorState) {
        if (current.value.toString().length > 6) {
            return false;
        }

        return true;
    }

    private portalDigits(state: CalculatorState): CalculatorState {
        if (!this.portalPos) return state;

        const sign = extractSign(state.value);
        let valueString = Math.abs(state.value).toString();

        let portalEntryIndex = valueString.length - this.portalPos[0];
        while (portalEntryIndex >= 0 && valueString[portalEntryIndex] != "0") {
            if (Number(valueString) % 1 != 0) {
                // I don't want to deal with this kind of decimal bullshit right now.
                return {
                    ...state,
                    value: Number.NaN,
                };
            }

            const portalValue =
                Number(valueString[portalEntryIndex]) *
                Math.pow(10, this.portalPos[1] - 1);
            const newValue =
                Number(
                    valueString.substring(0, portalEntryIndex) +
                        valueString.substring(portalEntryIndex + 1)
                ) + portalValue;
            valueString = newValue.toString();
            portalEntryIndex = valueString.length - this.portalPos[0];
        }

        return {
            ...state,
            value: sign * Number(valueString),
        };
    }

    private buildNextCalculatorState(
        state: CalculatorState,
        button: Button
    ): CalculatorState {
        const operationState = button.eval(state);
        const portalState = this.portalDigits(operationState);

        return {
            ...portalState,
            lastOperationLabel: button.getLabel(portalState),
        };
    }

    private failureStates: Record<number, Set<string>> = {}; // cache
    private depthCalculate(current: CalculatorState, moves: number): boolean {
        if (this.failureStates[moves]?.has(JSON.stringify(current))) {
            return false;
        }

        let hasWinningPath = false;
        if (current.value == this.goal) {
            this.depthResult.push([...this.depthStack.map((x) => ({ ...x }))]);
            return true;
        } else if (moves > 0) {
            for (const button of this.buttons) {
                const newState = this.buildNextCalculatorState(current, button);
                if (this.validateDepthPath(newState)) {
                    this.depthStack.push(newState);

                    // Do not swap the calculation and the winning path assignment around,
                    // Otherwise it wont look for more solutions at this point after finding a winning path
                    hasWinningPath =
                        this.depthCalculate(newState, moves - 1) ||
                        hasWinningPath;

                    this.depthStack.pop();
                }
            }
        }

        if (!hasWinningPath) {
            if (!this.failureStates[moves]) {
                this.failureStates[moves] = new Set();
            }
            this.failureStates[moves].add(JSON.stringify(current));
        }
        return hasWinningPath;
    }
}
