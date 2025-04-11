/** Action to detect clicks outside an element and execute a callback */
export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
        if (
            node && 
            !node.contains(event.target as Node) && 
            !event.defaultPrevented
        ) {
            callback();
        }
    };

    // Add event listener when the action is created
    document.addEventListener('click', handleClick, true);

    return {
        // Remove event listener when element is unmounted
        destroy() {
            document.removeEventListener('click', handleClick, true);
        },
        
        // Update callback if it changes
        update(newCallback: () => void) {
            callback = newCallback;
        }
    };
} 