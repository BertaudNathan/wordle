import { IWordProvider } from '../../../domain/interfaces/IWordProvider'
import { Word } from '../../../domain/models/word'
import { Letter } from '../../../domain/models/letter'

export class LocalWordProvider implements IWordProvider {
  async getRandomWord(size: number): Promise<Word> {
    const letters: Letter[] = []
    for (let i = 0; i < size; i++) {
      letters.push(new Letter(String.fromCharCode(65 + Math.floor(Math.random() * 26))))
    }
    return new Word(letters)
  }
}
