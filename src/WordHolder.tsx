// import { MaxGuesses, WordLength } from './Constants'
import { WordLength } from './Constants';
import { GameState } from './Types';

type WordHolderProps = {
    word: String;
    gameState: GameState
  }

function renderWordAsRow(word: String) : React.ReactElement {
    let letters = Array.from(word.padEnd(WordLength, " ")).map(l => <td>{l}</td>)
    return (
        <tr>{letters}</tr>
    )
}

function WordHolder(props: WordHolderProps) {
    let previousWords = props.gameState.history.map(h => renderWordAsRow(h))
    let current = renderWordAsRow(props.gameState.currentWord)
    return (
        <>
        <div>{props.word}</div>
        <table>
            {previousWords}
            {current}
        </table>
        </>
    )
}

export {WordHolder}
