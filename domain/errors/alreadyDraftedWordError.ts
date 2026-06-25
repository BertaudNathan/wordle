export class AlreadyDraftedWordError extends Error {
    constructor(message: string = "The provided word has already been drafted.") {
        super(message);
        this.name = "AlreadyDraftedWordError";
    }
}