import { Word } from "./word";
import { Try } from "./try";
import { Letter } from "./letter";
import { GameResult } from "./gameResult";


export class Game {

    public id: string;
    public word: Word;
    public tries: Try[];
    public result: GameResult;
    public usedLetters: Letter[];
    public numberOfTries: number;

    public constructor(id: string, word: Word) {
        this.id = id;
        this.word = word;
        this.tries = [];
        this.result = new GameResult();
        this.usedLetters = [];
        this.numberOfTries = 0;
    }

}