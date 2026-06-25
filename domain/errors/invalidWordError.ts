export class InvalidWordError extends Error {
    constructor(message: string = "The provided word is invalid.") {
        super(message);
        this.name = "InvalidWordError";
    }
}