import { IWordVerifyer } from "../domain/interfaces/IWordVerifyer";

export class MockWordVerifyer implements IWordVerifyer {
    private validWords: Set<string>;

    constructor() {
        this.validWords = new Set<string>(['apple', 'grape', 'peach', 'berry', 'mango', 'wrong','dwarf','dog']);
    }

    async verifyWord(word: string): Promise<boolean> {
        if (word.length == 5) {
            return this.validWords.has(word.toLowerCase());
        }
        return true; // for testing purposes, all word lengths other than 5 are considered valid
    }
}