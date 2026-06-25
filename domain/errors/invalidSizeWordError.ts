export class InvalidSizeWordError extends Error {
    constructor(message: string = "The provided word size is invalid.") {
        super(message);
        this.name = "InvalidSizeWordError";
    }
}