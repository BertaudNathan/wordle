import React, { useEffect, useMemo, useState } from 'react'
import { GameManager } from '../../external/GameManager'
import { APIWordProvider } from '../../external/APIWordProvider'
import { APIWordVerifyer } from '../../external/APIWordVerifyer'
import Board from './components/Board'
import Keyboard from './components/Keyboard'

const MAX = 6

export default function App() {
  const provider = useMemo(() => new APIWordProvider(), [])
  const verifyer = useMemo(() => new APIWordVerifyer(), [])
  const [gameManager] = useState(() => new GameManager(provider as any, verifyer as any))
  const [size, setSize] = useState(5)
  const [guesses, setGuesses] = useState<{ guess: string; feedback: string[] }[]>([])
  const [current, setCurrent] = useState('')
  const [keyStates, setKeyStates] = useState<Record<string, 'correct' | 'present' | 'absent'>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function start() {
    setError(null)
    setLoading(true)
    try {
      await gameManager.startGame(size)
      setGuesses([])
      setCurrent('')
      setKeyStates({})
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du démarrage')
    } finally {
      setLoading(false)
    }
  }

  function onKey(k: string) {
    if (gameManager.isGameWon() || gameManager.isGameLost()) return
    if (!k || !/^[A-Z]+$/i.test(k)) return false;
    if (k === 'ENTER') return submit()
    if (k === 'BACK' || k === 'BACKSPACE') return setCurrent((c) => c.slice(0, -1))
    if (current.length >= size) return
    setCurrent((c) => (c + k).slice(0, size))
  }

  async function submit() {
    if (gameManager.isGameWon() || gameManager.isGameLost()) return
    if (current.length !== size) return
    setError(null)
    setLoading(true)
    try {
      const feedback = await gameManager.guessWord(current)
      setGuesses((g) => [...g, { guess: current, feedback }])
    // update keyboard
    setKeyStates((s) => {
      const copy = { ...s }
      for (let i = 0; i < current.length; i++) {
        const ch = current[i]
        const fb = feedback[i]
        const prev = copy[ch]
        if (prev === 'correct') continue
        if (fb === 'correct') copy[ch] = 'correct'
        else if (fb === 'present' && prev !== 'correct') copy[ch] = 'present'
        else if (!prev) copy[ch] = 'absent'
      }
      return copy
    })
      setCurrent('')
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la vérification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app" onKeyUp={(e) => onKey(e.key.toUpperCase())} tabIndex={0}>
      <h1 style={{ textAlign: 'center' }}>Wordle</h1>
      <div className="controls">
        <label>Longueur: <input type="number" min={3} max={10} value={size} onChange={(e) => setSize(Number(e.target.value))} /></label>
        <button onClick={start} disabled={loading}>{loading ? '...': 'Démarrer'}</button>
        {error ? <div className="error">{error}</div> : null}
      </div>
      <div className="center">
        <Board guesses={guesses} currentGuess={current} size={size} maxAttempts={MAX} />
      </div>
      <div style={{textAlign: 'center', marginTop: 12}}>
        {gameManager.isGameWon() ? <strong style={{color: 'green'}}>Partie gagnée !</strong> : null}
        {gameManager.isGameLost() ? <strong style={{color: 'crimson'}}>Partie perdue — mot: {gameManager.getSecretWord()}</strong> : null}
      </div>
      <Keyboard onKey={onKey} states={keyStates} />
    </div>
  )
}
