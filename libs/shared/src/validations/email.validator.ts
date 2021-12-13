import type { ValidationFn } from "./base/model";

export class Email implements ValidationFn {
    public errMessage = 'Invalid email format';
    public errPrefix = 'email';

    public validate(value: any): boolean {
        return (value && !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
    }
}