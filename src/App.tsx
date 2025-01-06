import { useEffect, useState } from 'react'
import './App.css'
import { WordHolder } from './WordHolder'
import { GameState } from './Types'
import { WordLength } from './Constants'
import { WordList } from './WordList'



function App() {
const [gameState, setGameState] = useState<GameState>({currentWord: "", history: ["ZESTY", "LEMON"]})
  
  function handleUserInput(event: KeyboardEvent) {
    console.log("handle input")
    console.log(event)
    function isLetter(s: string) : boolean {
      return s.length == 1 && (s.toLowerCase() != s.toUpperCase())
    }
    let key = event.key.toUpperCase()
    switch(key) {
      case "ENTER": {
        console.log("enter")
        if (WordList.indexOf(gameState.currentWord.toLowerCase()) != -1) {
          console.log("exists")
          setGameState({...gameState, currentWord: "", history: gameState.history.concat(gameState.currentWord)})
        }
        break;
      }
      case "BACKSPACE": {
        let newCurrentWord = gameState.currentWord.slice(0, -1)
        setGameState({...gameState, currentWord: newCurrentWord})
        break;
      }
      default: {
        if(isLetter(key) && gameState.currentWord.length < WordLength) {
          let newCurrentWord = gameState.currentWord + key;
          setGameState({...gameState, currentWord: newCurrentWord})
        }
        break;
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleUserInput)
    return () => document.removeEventListener('keydown', handleUserInput)
  }, [gameState.currentWord]) // magic

  return (
    <>
      <div>
        <WordHolder word="ASSES" gameState={gameState} />
      </div>
    </>
  )
}

export default App
