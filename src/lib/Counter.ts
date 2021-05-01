
	export let count = 0;

	export const increment = (): void => {
		count += 1;
	};

    export function handleClick() {
		this.count += 1;
	}

    // export let val: number;
    // export default class Counter{
    //     public static count: number = 0;
    //     public static increment = (): void => {
    //         	count += 1;
    //         };

    // }