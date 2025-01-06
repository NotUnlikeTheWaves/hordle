// import { MaxGuesses, WordLength } from './Constants'
import { MaxGuesses, WordLength } from './Constants';
import { GameState } from './Types';
type WordHolderProps = {
    word: String;
    gameState: GameState
}

enum Correctness {
    Correct = "rgb(8, 159, 18)",
    WrongPosition = "rgb(198, 178, 0)",
    NotInThere = "Black"
}

// Only historic guesses in here!
function renderGuessAsRow(guess: String, props: WordHolderProps) : React.ReactElement {
    // 2 pass coloring: GREEN (correct), YELLOW (it's there somewhere)
    var coloring = [...Array(guess.length)].fill(Correctness.NotInThere)
    var wordLeft = Array.from(props.word);
    const movedOverPlaceholder = '_'
    // Pass 1
    for(let i = 0; i < guess.length; i++) {
        if (guess[i] == wordLeft[i]) {
            wordLeft[i] = movedOverPlaceholder
            coloring[i] = Correctness.Correct
        }
    }
    for(let i = 0; i < guess.length; i++) {
        if (wordLeft[i] == movedOverPlaceholder) {
            continue
        }
        for(let j = 0; j < wordLeft.length; j++) {
            if (guess[i] == wordLeft[j]) {
                wordLeft[j] = movedOverPlaceholder
                coloring[i] = Correctness.WrongPosition
            }
        }
    }

    let letters = Array.from(guess).map((l, i) => <td style={{backgroundColor: coloring[i]}}>{l}</td>)
    return (
        <tr style={{height: '27px', maxHeight: '27px'}}>{letters}</tr>
    )
}

// Only the current input!
function renderInputAsRow(guess: String) : React.ReactElement {
    let letters = Array.from(guess.padEnd(WordLength, " ")).map(l => <td>{l}</td>)
    return (
        <tr style={{height: '27px', maxHeight: '27px'}}>{letters}</tr>
    )
}

function renderUnaccessedRows(count: Number) : React.ReactElement {
    let results = [...Array(count).keys()].map(_ =>
        <tr>{[...Array(WordLength).keys()].map(_ => <td></td>)}</tr>
    )
    return <>{results}</>
}

function WordHolder(props: WordHolderProps) {
    let previousWords = props.gameState.history.map(h => renderGuessAsRow(h, props))
    let current = renderInputAsRow(props.gameState.currentWord)
    let unaccessedRowCount = MaxGuesses - (previousWords.length + 1)
    let unaccessedRows = renderUnaccessedRows(unaccessedRowCount)
    console.log(unaccessedRows)
    console.log("A")
    return (
        <>
        <table>
            {previousWords}
            {current}
            {unaccessedRows}
        </table>
        </>
    )
}

export {WordHolder}
