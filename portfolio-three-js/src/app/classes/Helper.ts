export class Helper {
    static getRandomFromArray(values: any[]): any {
        return values[Math.floor(Math.random() * values.length)];
    }
    static setGradientBackground(
        element: HTMLElement,
        crossColor: string,
        background: string
    ) {
        element.style.backgroundColor = background;
        // element.style.background = `
        //     radial-gradient(circle, transparent 20%, ${background} 20%, ${background} 80%, transparent 80%, transparent),
        //     radial-gradient(circle, transparent 20%, ${background} 20%, ${background} 80%, transparent 80%, transparent) 25px 25px,
        //     linear-gradient(red 2px, transparent 2px) 0 -2px,
        //     linear-gradient(90deg, red 2px, transparent 2px) -1px 0
        // `;
        element.style.backgroundSize = `50px 50px, 50px 50px, 25px 25px, 25px 25px`;
    }
}
