import { Button } from "./button";

export type CalculatorState = {
    value: number;
    operationModifier: number;
    stored: number | null;
    lastOperationLabel: string;
};

export type CalculatorInitProps = {
    buttons?: Button[];
    portalPos?: [number, number];
};
