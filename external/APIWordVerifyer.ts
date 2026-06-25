import { IWordVerifyer } from "../domain/interfaces/IWordVerifyer";

export class APIWordVerifyer implements IWordVerifyer {
    private apiUrl: string;
    constructor() {
        this.apiUrl = "https://freedictionaryapi.com/api/v1/entries/en";
    }

    async verifyWord(word: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}/${word.toLowerCase()}`);
            if (!response.ok) {
                return false;
            }
            const data = await response.json();
            return data.entries.length !== 0;
        } catch (error) {
            console.error('Error verifying word:', error);
            return false;
        }
    }
}