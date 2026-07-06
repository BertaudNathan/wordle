import { IWordProvider } from "../domain/interfaces/IWordProvider";
import { Letter } from "../domain/models/letter";
import { Word } from "../domain/models/word";

/*
Implementation mocké du système de choix de mot via une API
*/
export class APIWordProvider implements IWordProvider{
    getRandomWord(size: number): Promise<Word> {
        return new Promise<Word>((resolve, reject) => {
            fetch(`https://random-word-api.herokuapp.com/word?length=${size}`)
                .then(response => response.json())
                .then(data => {
                    const wordString = data[0];
                    const letters = wordString.split('').map((char: string) => new Letter(char));
                    const word = new Word(letters);
                    resolve(word);
                })
                .catch(error => reject(error));
        });}

    public constructor(){
        
    }
}