import React from 'react'

export default function Board({ guesses, currentGuess, size, maxAttempts }: { guesses: { guess: string; feedback: string[] }[]; currentGuess: string; size: number; maxAttempts: number }) {
  const rows = []
  for (let i = 0; i < maxAttempts; i++) {
    const g = guesses[i]
    const letters = []
    const isLastGuess = g && i === guesses.length - 1
    if (g) {
      for (let j = 0; j < size; j++) {
        const ch = g.guess[j] || ''
        const status = g.feedback[j] || 'unknown'
        letters.push(
          <div
            key={j}
            className={`cell ${status}${isLastGuess ? ' flip' : ''}`}
            style={isLastGuess ? ({ '--delay': `${j * 0.15}s` } as React.CSSProperties) : undefined}
          >
            {ch}
          </div>
        )
      }
    } else if (i === guesses.length) {
      // current
      for (let j = 0; j < size; j++) {
        letters.push(
          <div key={j} className="cell">
            {currentGuess[j] || ''}
          </div>
        )
      }
    } else {
      for (let j = 0; j < size; j++) letters.push(<div key={j} className="cell" />)
    }

    rows.push(
      <div key={i} className="board-row">
        {letters}
      </div>
    )
  }

  return <div className="board">{rows}</div>
}
