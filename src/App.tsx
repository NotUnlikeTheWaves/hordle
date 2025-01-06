import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { WordHolder } from './WordHolder'
import { GameState } from './Types'


function App() {
  const [gameState, setGameState] = useState<GameState>({currentWord: "aha", history: ["zesty", "lemon"]})

  return (
    <>
      <div>
        Pengis
        <WordHolder word="Yolo" gameState={gameState} />
      </div>
    </>
  )
}

export default App
