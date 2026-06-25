import { Letter } from "../models/letter";
import { Word } from "../models/word";

export interface IWordProvider {
    getRandomWord(size: number): Promise<Word>;
}