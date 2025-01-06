import { useEffect, useState } from 'react'
import './App.css'
import { WordHolder } from './WordHolder'
import { GameState } from './Types'
import { WordLength, NumberOfWordles, MaxGuesses } from './Constants'
import { WordList } from './WordList'
import { getWordList } from './Random'

const activeWords = getWordList()
// const activeWords = ["LIBEL", "HELLO", "THERE"]

function showGameWon(gameState: GameState) : React.ReactElement {
  return (
    <h1>Congrats! You completed all {NumberOfWordles} wordles in {gameState.history.length}/{MaxGuesses} attempts.</h1>
  )
}

function showGameLost(gameState: GameState, gamesWon: number)  : React.ReactElement {
  return (
    <h1>You lose! You completed {gamesWon} wordles in {MaxGuesses} attempts.</h1>
  )
}

enum GameFormat {
  Tall = '1fr 1fr 1fr 1fr 1fr 1fr',
  Medium = '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  Wide = '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'
}

function getNextFormat(format: GameFormat) : GameFormat {
  switch(format) {
    case GameFormat.Medium: {
      return GameFormat.Tall
    }
    case GameFormat.Tall: {
      return GameFormat.Wide
    }
    case GameFormat.Wide: {
      return GameFormat.Medium
    }
  }
}

function showLettersUsed(gameState: GameState) : React.ReactElement {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
  let result = alphabet.map(l => {
      if (gameState.history.some(h => h.indexOf(l) != -1)) {
        return <div key={l} className='letters-used-element' style={{backgroundColor: "rgb(198, 134, 206)"}}>{l}</div>
      }
      else return <div key={l} className='letters-used-element'>{l}</div>
    }
  )
  return <><div className='letters-used-container'>{result}</div></>
}

function App() {
  const [gameState, setGameState] = useState<GameState>({currentWord: "", history: ["SPEAK"]})
  const [format, setFormat] = useState<GameFormat>(GameFormat.Tall);

  function handleUserInput(event: KeyboardEvent) {
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

  console.log(activeWords)

  useEffect(() => {
    document.addEventListener('keydown', handleUserInput)
    return () => document.removeEventListener('keydown', handleUserInput)
  }, [gameState.currentWord]) // magic

  let wordles = []
  var numberOfCompleteWordles = 0
  for(let i = 0; i < activeWords.length; i++) {
    wordles.push(<div className="grid-child-element purple"><WordHolder key={i} word={activeWords[i]} gameState={gameState} /></div>)
    if (gameState.history.indexOf(activeWords[i]) != -1) {
      numberOfCompleteWordles++
    }
  }

  let gameWon = numberOfCompleteWordles == activeWords.length
  let gameLost = (gameState.history.length == MaxGuesses) && !gameWon

  return (
    <>
      <div>
        <div className="top">
          <button onClick={() => setFormat(getNextFormat(format))}>Change format</button>
          A game of 64ordle (and not enough whitespace)
        </div>
        {gameWon && showGameWon(gameState)}
        {gameLost && showGameLost(gameState, numberOfCompleteWordles)}
        <div className="grid-container-element" style={{gridTemplateColumns: format}}>
          {wordles}
        </div>
      </div>
      <div className="footer">
        {showLettersUsed(gameState)}
      </div>
    </>
  )
}

export default App
