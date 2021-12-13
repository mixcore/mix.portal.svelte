import type { ValidationFn } from "./base/model";

export class Confirmation implements ValidationFn {
    public errMessage = 'Confirm incorrect';
    public errPrefix = 'confirm';
    public toCompare: () => string;

    public validate(value: any): boolean {
        return value && value === this.toCompare();
    }

    constructor(value: () => string) {
        this.toCompare = value;
    }
}