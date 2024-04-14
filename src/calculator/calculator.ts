import { Button } from './button'

export class Calculator {
    buttons: Button[] = [];

    // For calculation
    private depthStack: Button[] = [];
    private depthResult: Button[][] = [];
    private goal: number = 0;

    constructor(buttons?: Button[]) {
        this.buttons = buttons ?? [];
    };

    calculate(initial: number, goal: number, moves: number = 100) {
        this.goal = goal;
        this.depthStack = [];
        this.depthResult = [];

        this.depthCalculate(initial, moves);

        return this.depthResult;
    };

    private depthCalculate(current: number, moves: number) {
        if (current == this.goal) {
            this.depthResult.push([...this.depthStack]);
        }
        else if (moves > 0) {
            for (const button of this.buttons) {
                if (button.eval(current) != current) {
                    this.depthStack.push(button)
                    this.depthCalculate(button.eval(current), moves - 1);
                    this.depthStack.pop();
                }
            }
        }
    }
};