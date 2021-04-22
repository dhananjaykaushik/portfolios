export class Helper {
    static getRandomFromArray(values: any[]): any {
        return values[Math.floor(Math.random() * values.length)];
    }
    static setGradientBackground(
        element: HTMLElement,
        lineColor: string,
        dotColor: string,
        background: string
    ) {
        element.style.background = `
            radial-gradient(${dotColor} 4px, transparent 4px),
            radial-gradient(${dotColor} 4px, transparent 4px),
            linear-gradient(${background} 10px, transparent 0),
            linear-gradient(45deg, transparent 74px, transparent 75px, ${lineColor} 75px, ${lineColor} 76px, transparent 77px, transparent 109px),
            linear-gradient(-45deg, transparent 75px, transparent 76px, ${lineColor} 76px, ${lineColor} 77px, transparent 78px, transparent 109px),
            #fff
         `;
        element.style.backgroundColor = background;
        element.style.backgroundSize = `109px 109px, 109px 109px,100% 12px, 109px 109px, 109px 109px`;
        element.style.backgroundPosition = `54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px`;
    }
}
