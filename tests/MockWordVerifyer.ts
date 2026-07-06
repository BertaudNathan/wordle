import { IWordVerifyer } from "../domain/interfaces/IWordVerifyer";

/*
Implementation mocké de la verification des mots, pour les tests unitaires
*/
export class MockWordVerifyer implements IWordVerifyer {
    private validWords: Set<string>;

    constructor(validWords?: string[]) {
        this.validWords = new Set<string>(
            (validWords ?? ['apple', 'grape', 'peach', 'berry', 'mango', 'wrong', 'dwarf', 'crane', 'radar', 'three']).map(w => w.toLowerCase())
        );
    }

    async verifyWord(word: string): Promise<boolean> {
        return this.validWords.has(word.toLowerCase());
    }
}