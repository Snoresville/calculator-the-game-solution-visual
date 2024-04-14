export class Button {
    private evalFunc: (value: number) => number
    private label = "???";

    constructor(transformationFunc: (value: number) => number, label?: string) {
        this.evalFunc = transformationFunc
        if (label) {
            this.label = label
        }
    }

    eval(incoming: number) {
        return this.evalFunc ? this.evalFunc(incoming) : incoming;
    }

    getLabel() {
        return this.label
    }
}