import { IWordProvider } from '../domain/interfaces/IWordProvider';
import { IWordVerifyer } from '../domain/interfaces/IWordVerifyer';
import { Game } from '../domain/models/game';
import { Word } from '../domain/models/word';
import { Letter } from '../domain/models/letter';
import { Try } from '../domain/models/try';
import { LetterResult } from '../domain/models/letterResult';
import { InvalidWordError } from '../domain/errors/invalidWordError';
import { InvalidSizeWordError } from '../domain/errors/invalidSizeWordError';
import { AlreadyDraftedWordError } from '../domain/errors/alreadyDraftedWordError';


export class GameManager {
    getAttempts(): number {
        return this.game ? this.game.numberOfTries : 0;
    }
    getMaxAttempts(): any {
        return 6;
    }

    async isValidWord(word: string | undefined): Promise<boolean> {
        if (!word) return false;
        //validate the letters with regex and then use the wordVerifyer to check if the word is valid
        const regex = /^[A-Z]+$/i;
        if (!word || !regex.test(word)) return false;
        return await this.wordVerifyer.verifyWord(word);
    }


    async guessWord(word: string | undefined): Promise<LetterResult[]> {
        if (!this.game) throw new Error('No active game');
        if (!word) throw new Error('No guess provided');
        if (word.length !== this.game.word.Letters.length) throw new InvalidSizeWordError();
        if (!await this.isValidWord(word)) throw new InvalidWordError();
        if (this.game.tries.some(t => t.word.toUpperCase() === word.toUpperCase())) throw new AlreadyDraftedWordError();
        const guess = word.toUpperCase();
        const target = this.game.word.Letters.map(l => l.value.toUpperCase()).join('');
        const feedback: LetterResult[] = [];

        // simple Wordle-like evaluation: mark correct, present, absent
        const targetLetters = target.split('');
        const remaining: string[] = [];
        // first pass: mark correct
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === targetLetters[i]) {
                feedback.push('correct');
            } else {
                feedback.push('pending');
                remaining.push(targetLetters[i]);
            }
        }
        // second pass: present/absent
        for (let i = 0; i < guess.length; i++) {
            if (feedback[i] === 'correct') continue;
            const g = guess[i];
            const idx = remaining.indexOf(g);
            if (idx >= 0) {
                feedback[i] = 'present';
                remaining.splice(idx, 1);
            } else {
                feedback[i] = 'absent';
            }
        }

        // update game state
        this.game.numberOfTries += 1;
        this.game.tries.push(new Try(this.game.numberOfTries, guess, target));
        this.game.result.numberOfTries = this.game.numberOfTries;
        this.game.result.isWin = feedback.every(f => f === 'correct');

        return feedback;
    }
    getSecretWord() {
        if (!this.game) return undefined;
        return this.game.word.Letters.map(l => l.value.toUpperCase()).join('');
    }
    isGameWon(): any {
        return this.game ? this.game.result.isWin : false;
    }
    isGameLost(): any {
        if (!this.game) return false;
        return this.game.numberOfTries >= this.getMaxAttempts() && !this.game.result.isWin;
    }
    resetGame() {
        this.game = null;
    }
    async startGame(size: number) {
        // create a random word of given length asynchronously
        var word = await this.wordProvider.getRandomWord(size);
        const id = Math.random().toString(36).substring(2, 9);
        this.game = new Game(id, word);
        return this.game;
    }
    isGameActive(): any {
        return this.game != null;
    }
    private wordProvider: IWordProvider;
    private wordVerifyer: IWordVerifyer ;
    private game: Game | null;
    public constructor(wordProvider: IWordProvider, wordVerifyer: IWordVerifyer) {
        this.wordProvider = wordProvider;
        this.wordVerifyer = wordVerifyer;
        this.game = null;
    }
}