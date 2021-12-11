import type { ValidationFn } from "./base/model";

export class Required implements ValidationFn {
    public errMessage = 'This field is required';
    public errPrefix = 'required';

    public validate(value: any): boolean {
        return value !== null && value !== undefined && value !== "";
    }
}