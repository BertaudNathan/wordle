import { LetterResult } from './letterResult';

export class Try {
    public letterResults: LetterResult[];
    public TryNumber: number;
    public IsWin: boolean;
    public word: string;

    public constructor(tryNumber: number, givenWord: string, targetWord: string) {
        this.letterResults = this.evaluateLetterResults(givenWord, targetWord);
        this.TryNumber = tryNumber;
        this.IsWin = this.letterResults.length === targetWord.length && this.letterResults.every(result => result === 'correct');
        this.word = givenWord;
    }

    private evaluateLetterResults(givenWord: string, targetWord: string): LetterResult[] {
        const results: LetterResult[] = new Array(givenWord.length).fill('absent');
        const targetLetters = targetWord.split('');
        const givenLetters = givenWord.split('');
        const remaining: string[] = [];

        // First pass: mark correct positions
        for (let i = 0; i < givenLetters.length; i++) {
            if (givenLetters[i] === targetLetters[i]) {
                results[i] = 'correct';
            } else {
                remaining.push(targetLetters[i]);
            }
        }

        // Second pass: mark present letters (handles duplicates correctly)
        for (let i = 0; i < givenLetters.length; i++) {
            if (results[i] === 'correct') continue;
            const idx = remaining.indexOf(givenLetters[i]);
            if (idx >= 0) {
                results[i] = 'present';
                remaining.splice(idx, 1);
            }
        }

        return results;
    }
}