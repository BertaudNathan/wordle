import { Letter } from "../models/letter";
import { Word } from "../models/word";

/*
Contrat d'implémentation pour les fournisseurs de mots
*/
export interface IWordProvider {
    getRandomWord(size: number): Promise<Word>;
}