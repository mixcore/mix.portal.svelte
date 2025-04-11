import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/**
 * Combine class names with Tailwind CSS utility classes
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Initialize CSS variables required for the app
 * This should be called once when the app is initialized
 */
export function initializeThemeVariables() {
	if (typeof document !== 'undefined') {
		// Set sidebar width variables
		document.documentElement.style.setProperty('--sidebar-width', '250px');
		document.documentElement.style.setProperty('--sidebar-width-icon', '60px');
		
		// Set sidebar theming variables
		document.documentElement.style.setProperty('--sidebar-foreground', 'hsl(var(--foreground))');
		document.documentElement.style.setProperty('--sidebar-background', 'hsl(var(--background))');
		document.documentElement.style.setProperty('--sidebar-border', 'hsl(var(--border))');
		document.documentElement.style.setProperty('--sidebar-accent', 'hsl(var(--accent))');
		document.documentElement.style.setProperty('--sidebar-accent-foreground', 'hsl(var(--accent-foreground))');
		document.documentElement.style.setProperty('--sidebar-primary', 'hsl(var(--primary))');
		document.documentElement.style.setProperty('--sidebar-primary-foreground', 'hsl(var(--primary-foreground))');
		document.documentElement.style.setProperty('--sidebar-ring', 'hsl(var(--ring))');
		
		// Any other theme variables that need to be set
	}
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
}; 