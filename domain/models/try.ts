import { LetterResult } from './letterResult';

export class Try {
    public letterResults: Map<string, LetterResult>;
    public TryNumber: number;
    public IsWin: boolean;
    public word:string;

    public constructor(tryNumber: number, givenWord: string, targetWord: string) {
        this.letterResults = this.evaluateLetterResults(givenWord, targetWord);
        this.TryNumber = tryNumber;
        this.IsWin = this.letterResults.size === 5 && Array.from(this.letterResults.values()).every(result => result === 'correct');
        this.word = givenWord;

    }

    private evaluateLetterResults(givenWord: string, targetWord: string): Map<string, LetterResult> {
        const results = new Map<string, LetterResult>();
        const targetLetters = targetWord.split('');
        const givenLetters = givenWord.split('');
        for (let i = 0; i < givenLetters.length; i++) {
            if (givenLetters[i] === targetLetters[i]) {
                results.set(givenLetters[i], 'correct');
            } else if (targetLetters.includes(givenLetters[i])) {
                results.set(givenLetters[i], 'present');
            } else {
                results.set(givenLetters[i], 'absent');
            }
        }
        return results;
    }
}