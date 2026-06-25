import { IWordProvider } from "../domain/interfaces/IWordProvider";
import { Letter } from "../domain/models/letter";
import { Word } from "../domain/models/word";

export class MockWordProvider implements IWordProvider {
    getRandomWord(size: number): Promise<Word> {
        return new Promise<Word>((resolve, reject) => {
            if (size == 5) {
                const letters: Letter[] = [
                    new Letter("A"),
                    new Letter("P"),
                    new Letter("P"),
                    new Letter("L"),
                    new Letter("E")
                ];
                const word = new Word(letters);
                resolve(word);
            }
            else {
                const letters: Letter[] = [];
                for (let i = 0; i < size; i++) {
                    const letter = new Letter(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
                    letters.push(letter);
                }
                const word = new Word(letters);
                resolve(word);
            }
        });
    }

    public constructor() {

    }

}