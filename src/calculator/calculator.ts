import { Button } from "./button";
import { INITIAL_STATE } from "./constants";
import { CalculatorState } from "./types";

export class Calculator {
    buttons: Button[] = [];

    // For calculation
    private depthStack: CalculatorState[] = [];
    private depthResult: CalculatorState[][] = [];
    private goal: number = 0;

    constructor(buttons?: Button[]) {
        this.buttons = buttons ?? [];
    }

    calculate(initial: number, goal: number, moves: number = 100) {
        this.goal = goal;
        this.depthStack = [{
            ...INITIAL_STATE,
            value: initial,
        },];
        this.depthResult = [];

        this.depthCalculate(
            this.depthStack[0],
            moves
        );

        return this.depthResult;
    }

    private validateDepthPath(current: CalculatorState) {
        if (current.value.toString().length > 6) {
            return false;
        }

        return true;
    }

    private buildNextCalculatorState(current: CalculatorState, operation: Button): CalculatorState {
        return {
            ...operation.eval(current),
            lastOperationLabel: operation.getLabel(current)
        }
    }

    private failureStates: Record<number, Set<string>> = {} // cache
    private depthCalculate(current: CalculatorState, moves: number): boolean {
        if (this.failureStates[moves]?.has(JSON.stringify(current))) {
            return false
        }

        let hasWinningPath = false
        if (current.value == this.goal) {
            this.depthResult.push([...this.depthStack.map(x => ({ ...x }))]);
            return true
        } else if (moves > 0) {
            for (const button of this.buttons) {
                const newState = this.buildNextCalculatorState(current, button)
                if (this.validateDepthPath(newState)) {
                    this.depthStack.push(newState);

                    // Do not swap the calculation and the winning path assignment around,
                    // Otherwise it wont look for more solutions at this point after finding a winning path
                    hasWinningPath = this.depthCalculate(button.eval(current), moves - 1) || hasWinningPath

                    this.depthStack.pop();
                }
            }
        }

        if (!hasWinningPath) {
            if (!this.failureStates[moves]) {
                this.failureStates[moves] = new Set()
            }
            this.failureStates[moves].add(JSON.stringify(current))
        }
        return hasWinningPath
    }
}
