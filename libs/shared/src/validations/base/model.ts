export interface FormObject {
    [key: string]: FormControl;
}

export class FormControl {
    public value: any;
    public validations: ValidationFn[]

    constructor(value: any, ...validations: ValidationFn[]) {
        this.value = value;
        this.validations = validations;
    }
}

export interface ValidationFn {
    errPrefix: string;
    errMessage: string;
    validate(value: any): boolean;
}