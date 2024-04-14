import { Calculator } from "./calculator";
import { Level } from "./levels";

export function generateLevelSolutions(level: Level) {
    const calculator = new Calculator(level.buttons);
    const results = calculator.calculate(
        level.initial,
        level.goal,
        level.moves
    );
    results.sort((a, b) => a.length - b.length);
    return results;
}
