export class Helper {
    static getRandomFromArray(values: any[]): any {
        return values[Math.floor(Math.random() * values.length)];
    }

    static setGradientBackgroundValues(
        element: HTMLElement,
        lineColor: string,
        dotColor: string,
        background: string
    ) {
        element.style.background = `
            radial-gradient(var(--home-background-pattern-dot-color) 4px, transparent 4px),
            radial-gradient(var(--home-background-pattern-dot-color) 4px, transparent 4px),
            linear-gradient(var(--primary) 10px, transparent 0),
            linear-gradient(45deg, transparent 74px, transparent 75px, var(--home-background-pattern-line-color) 75px, var(--home-background-pattern-line-color) 76px, transparent 77px, transparent 109px),
            linear-gradient(-45deg, transparent 75px, transparent 76px, var(--home-background-pattern-line-color) 76px, var(--home-background-pattern-line-color) 77px, transparent 78px, transparent 109px),
            #fff
         `;
        element.style.backgroundColor = `var(--primary)`;
        element.style.backgroundSize = `109px 109px, 109px 109px,100% 12px, 109px 109px, 109px 109px`;
        element.style.backgroundPosition = `54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px`;
    }

    static changeCssVariableValue(variableName: string, value: string): void {
        const rootElement = document.querySelector(':root');
        (rootElement as any).style.setProperty(`--${variableName}`, value);
    }
}
