import React from 'react'

type KeyState = Record<string, 'correct' | 'present' | 'absent' | 'unknown'>

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export default function Keyboard({ onKey, states }: { onKey: (k: string) => void; states: KeyState }) {
  const renderKey = (k: string) => {
    const s = states[k] || 'unknown'
    const className = `key ${s}`
    return (
      <button key={k} className={className} onClick={() => onKey(k)}>
        {k}
      </button>
    )
  }

  return (
    <div className="keyboard">
      {rows.map((r) => (
        <div className="key-row" key={r}>
          {r.split('').map(renderKey)}
          {r === 'ZXCVBNM' ? (
            <>
              <button className="key action" onClick={() => onKey('ENTER')}>Enter</button>
              <button className="key action" onClick={() => onKey('BACK')}>⌫</button>
            </>
          ) : null}
        </div>
      ))}
    </div>
  )
}
