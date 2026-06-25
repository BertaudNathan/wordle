export class GameResult {
    public isWin: boolean;
    public numberOfTries: number;
    public constructor() {
        this.isWin = false;
        this.numberOfTries = 0;
    }
}