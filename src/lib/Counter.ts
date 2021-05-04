import {getDefaultAxiosConfiguration ,MixRestService} from "./mix-lib"

export let count = 0;
export let text = '';

export function mainIncrement() {
	return (count += 1);
}
