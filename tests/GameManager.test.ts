import { describe, expect, it } from "vitest";
import { GameManager } from "../external/GameManager";
import { MockWordProvider } from "./MockWordProvider";
import { MockWordVerifyer } from "./MockWordVerifyer";
import { InvalidWordError } from "../domain/errors/invalidWordError";
import { InvalidSizeWordError } from "../domain/errors/invalidSizeWordError";
import { AlreadyDraftedWordError } from "../domain/errors/alreadyDraftedWordError";
import { ActiveGameError } from "../domain/errors/activeGameError";


describe("GameManager", () => {
   describe("getRandomWord", () => {
      it("should return a random word", async () => {
        //Given 
        const wordProvider = new MockWordProvider()
        const word = await wordProvider.getRandomWord(5)
        const wordString = word.toString()
        const expectedResult = true
        //When
        const result = wordString != "" && wordString != undefined;
        //then
        expect(result).toBe(expectedResult);
        });

    });

    describe("startGame", () => {
      it("should initialize a new game", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        //When
        await gameManager.startGame(5);
        //Then
        expect(gameManager.isGameActive()).toBe(true);
        expect(gameManager.getAttempts()).toBe(0);
        expect(gameManager.getMaxAttempts()).toBe(6);
      });
    });

    describe("guessWord", () => {

      it("should reject if no game is active", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(),new MockWordVerifyer());
        //When
        //Then
        expect(gameManager.guessWord("APPLE")).rejects.toThrow(ActiveGameError)
      });

      it("should accept a guess and return feedback", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(),new MockWordVerifyer());
        await gameManager.startGame(5);
        //When
        const feedback = gameManager.guessWord("GRAPE");
        //Then
        expect(feedback).toBeDefined();
        expect((await feedback).length).toBe(5);
      });
      it("should reject if word is invalid", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(),new MockWordVerifyer());
        await gameManager.startGame(5);
        //When

        //Then
        expect(gameManager.guessWord("TRAPS")).rejects.toThrow(InvalidWordError)
      }); 
      it("should reject if the size of the given word is not the same as searched word", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(),new MockWordVerifyer());
        await gameManager.startGame(5);
        //When

        //Then
        expect(gameManager.guessWord("DOG")).rejects.toThrow(InvalidSizeWordError)
      });     
      it("should reject if the word was already given", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(),new MockWordVerifyer());
        await gameManager.startGame(5);
        //When
        await gameManager.guessWord("GRAPE");
        
        //Then
        expect(gameManager.guessWord("GRAPE")).rejects.toThrow(AlreadyDraftedWordError)
      }); 
      it("should increment attempts after each guess", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        const initialAttempts = gameManager.getAttempts();
        //When
        await gameManager.guessWord("GRAPE");
        //Then
        expect(gameManager.getAttempts()).toBe(initialAttempts + 1);
      });

      it("should return correct feedback for correct guess", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        const secretWord = gameManager.getSecretWord();
        //When
        const feedback = await gameManager.guessWord(secretWord);
        //Then
        expect(feedback.every(f => f === "correct")).toBe(true);
      });
    });

    describe("isGameWon", () => {
      it("should return true when correct word is guessed", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        const secretWord = gameManager.getSecretWord();
        //When
        await gameManager.guessWord(secretWord);
        //Then
        expect(gameManager.isGameWon()).toBe(true);
      });

      it("should return false before correct guess", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        //When
        await gameManager.guessWord("WRONG");
        //Then
        expect(gameManager.isGameWon()).toBe(false);
      });
    });

    describe("isGameLost", () => {
      it("should return true when max attempts exceeded", async () => {
        //Given
        const secretWord = "APPLE";
        const wrongGuesses = ["WRONG", "GRAPE", "PEACH", "BERRY", "MANGO", "DWARF"];
        const gameManager = new GameManager(new MockWordProvider(secretWord), new MockWordVerifyer());
        await gameManager.startGame(5);
        //When
        for (const guess of wrongGuesses) {
          await gameManager.guessWord(guess);
        }
        //Then
        expect(gameManager.isGameLost()).toBe(true);
      });

      it("should return false when attempts remain", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        //When
        await gameManager.guessWord("WRONG");
        //Then
        expect(gameManager.isGameLost()).toBe(false);
      });
    });

    describe("guessWord - multiple letters rule", () => {

      it("should not mark a letter as present twice if it appears only once in the secret", async () => {
        // Secret: CRANE — only one A and one R
        // Guess:  RADAR — has two A's and two R's
        // Expected: R=present, A=present, D=absent, A=absent (already consumed), R=absent (already consumed)
        const secretWord = "CRANE";
        const playerGuess = "RADAR";
        const validWords = ["crane", "radar"];
        const gameManager = new GameManager(new MockWordProvider(secretWord), new MockWordVerifyer(validWords));
        await gameManager.startGame(5);
        //When
        const feedback = await gameManager.guessWord(playerGuess);
        //Then
        expect(feedback).toEqual(['present', 'present', 'absent', 'absent', 'absent']);
      });

      it("should mark the correct occurrence as correct and the extra occurrence as present when the secret has a duplicate letter", async () => {
        // Secret: SPEED — two E's
        // Guess:  THREE — two E's: E at pos 3 matches exactly, E at pos 4 is present (one E remains)
        const secretWord = "SPEED";
        const playerGuess = "THREE";
        const validWords = ["speed", "three"];
        const gameManager = new GameManager(new MockWordProvider(secretWord), new MockWordVerifyer(validWords));
        await gameManager.startGame(5);
        //When
        const feedback = await gameManager.guessWord(playerGuess);
        //Then
        expect(feedback).toEqual(['absent', 'absent', 'absent', 'correct', 'present']);
      });

    });

    describe("getSecretWord", () => {
      it("should return the secret word for the current game", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        //When
        const secretWord = gameManager.getSecretWord();
        //Then
        expect(secretWord).toBeDefined();
        expect(secretWord?.length).toBe(5);
      });
    });

    describe("resetGame", () => {
      it("should reset game state", async () => {
        //Given
        const gameManager = new GameManager(new MockWordProvider(), new MockWordVerifyer());
        await gameManager.startGame(5);
        await gameManager.guessWord("WRONG");
        //When
        gameManager.resetGame();
        //Then
        expect(gameManager.getAttempts()).toBe(0);
        expect(gameManager.isGameWon()).toBe(false);
        expect(gameManager.isGameLost()).toBe(false);
      });
    });
});