/*
Contrat d'implémentation pour les vérificateurs de mots
*/
export interface IWordVerifyer {
    verifyWord(word: string): Promise<boolean>;
}