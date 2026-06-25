import { Letter } from './letter';

export class Word {
    public Letters: Letter[];
    public numberOfLetters: number;

    public constructor(letters: Letter[]) {
        this.Letters = letters;
        this.numberOfLetters = letters.length;
    }
    public toString() : string{
        return this.Letters.map(l=>l.value).join();
    }
}