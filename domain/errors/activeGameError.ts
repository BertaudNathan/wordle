export class ActiveGameError extends Error {
    constructor(message: string = "No active game. Please start a game first.") {
        super(message);
        this.name = "ActiveGameError";
    }
}