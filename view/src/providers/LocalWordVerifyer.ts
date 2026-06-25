import { IWordVerifyer } from '../../../domain/interfaces/IWordVerifyer'

export class LocalWordVerifyer implements IWordVerifyer {
  async verifyWord(word: string): Promise<boolean> {
    // simple verify: accept only alphabetic strings of length > 0
    if (!word) return false
    return /^[A-Z]+$/i.test(word)
  }
}
