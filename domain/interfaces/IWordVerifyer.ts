export interface IWordVerifyer {
    verifyWord(word: string): Promise<boolean>;
}