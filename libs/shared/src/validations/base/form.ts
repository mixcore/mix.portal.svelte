import { createForm } from "svelte-forms-lib";
import type { Readable, Writable } from "svelte/store";
import type { FormObject } from "./model";

export class MixForm {
    public static createForm<T>(input: FormObject, submitCallback?: () => void): FormState<T> {
        let initialValue = <T>{};
        Object.keys(input).map(key => {
            initialValue[key] = input[key].value;
        })
        
        return createForm({
            initialValues: initialValue,
            validate: (values) => {
                let errors = {};
                let keys = Object.keys(input);

                for (let key of keys) {
                    const validateFn = input[key].validations ?? [];
                    const value = values[key];

                    if (!validateFn.length) continue;
                    errors[key] = {};
        
                    const err = validateFn.find(v => v.validate(value) === false);
                    if (err !== undefined) {
                        errors[key][err.errPrefix] = err.errMessage;
                    }
                }

                return errors;
            },
            onSubmit: (values) => {
                if (submitCallback) {
                    submitCallback();
                }
            }
        });
    }
}

export type FormState<Inf = Record<string, any>> = {
    form: Writable<Inf>;
    errors: Writable<Record<keyof Inf, string>>;
    touched: Writable<Record<keyof Inf, boolean>>;
    modified: Readable<Record<keyof Inf, boolean>>;
    isValid: Readable<boolean>;
    isSubmitting: Writable<boolean>;
    isValidating: Writable<boolean>;
    isModified: Readable<boolean>;
    updateField: (field: keyof Inf, value: any) => void;
    updateValidateField: (field: keyof Inf, value: any) => void;
    updateTouched: (field: keyof Inf, value: any) => void;
    validateField: (field: keyof Inf) => Promise<any>;
    updateInitialValues: (newValues: Inf) => void;
    handleReset: () => void;
    state: Readable<{
      form: Inf;
      errors: Record<keyof Inf, string>;
      touched: Record<keyof Inf, boolean>;
      modified: Record<keyof Inf, boolean>;
      isValid: boolean;
      isSubmitting: boolean;
      isValidating: boolean;
      isModified: boolean;
    }>;
    handleChange: (event: Event) => any;
    handleSubmit: (event: Event) => any;
};