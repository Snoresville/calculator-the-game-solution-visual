import { Button } from "./button";
import { INITIAL_STATE } from "./constants";
import { CalculatorState } from "./types";

export class Calculator {
    buttons: Button[] = [];

    // For calculation
    private depthStack: Button[] = [];
    private depthResult: Button[][] = [];
    private goal: number = 0;

    constructor(buttons?: Button[]) {
        this.buttons = buttons ?? [];
    }

    calculate(initial: number, goal: number, moves: number = 100) {
        this.goal = goal;
        this.depthStack = [];
        this.depthResult = [];

        this.depthCalculate(
            {
                ...INITIAL_STATE,
                value: initial,
            },
            moves
        );

        return this.depthResult;
    }

    private validateDepthPath(current: CalculatorState, operation: Button) {
        if (operation.eval(current).value.toString().length > 6) {
            return false;
        }

        return true;
    }

    private depthCalculate(current: CalculatorState, moves: number) {
        if (current.value == this.goal) {
            this.depthResult.push([...this.depthStack]);
        } else if (moves > 0) {
            for (const button of this.buttons) {
                if (this.validateDepthPath(current, button)) {
                    this.depthStack.push(button);
                    this.depthCalculate(button.eval(current), moves - 1);
                    this.depthStack.pop();
                }
            }
        }
    }
}
