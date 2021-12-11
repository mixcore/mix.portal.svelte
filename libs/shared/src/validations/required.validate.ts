import type { ValidationFn } from "./base/model";

export class Required implements ValidationFn {
    public errMessage = 'This field is required';

    public validate(value: any): boolean {
        return !!value;
    }
}