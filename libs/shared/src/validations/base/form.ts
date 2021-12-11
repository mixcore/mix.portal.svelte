import type { FormObject } from "./model";

export class MixForm {
    public static createForm<T>(value: FormObject): void {
        let initialValue = <T>{};
        let errors = {};

        Object.keys(value).map(key => {
            initialValue[key] = value[key].value;
        })

        console.log(initialValue);
    }
}