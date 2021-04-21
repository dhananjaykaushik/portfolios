export class Helper {
    static getRandomFromArray(values: any[]): any {
        return values[Math.floor(Math.random() * values.length)];
    }
}
