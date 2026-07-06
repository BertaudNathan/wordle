import { IWordProvider } from "../domain/interfaces/IWordProvider";
import { Letter } from "../domain/models/letter";
import { Word } from "../domain/models/word";

export class MockWordProvider implements IWordProvider {
    private fixedWord: string | undefined;

    public constructor(fixedWord?: string) {
        this.fixedWord = fixedWord;
    }

    getRandomWord(size: number): Promise<Word> {
        const wordStr = this.fixedWord ?? "APPLE";
        const letters: Letter[] = wordStr.split('').map(c => new Letter(c.toUpperCase()));
        return Promise.resolve(new Word(letters));
    }
}
