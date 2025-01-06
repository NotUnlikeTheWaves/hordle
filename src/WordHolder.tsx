// import { MaxGuesses, WordLength } from './Constants'
import { MaxGuesses, WordLength } from './Constants';
import { GameState } from './Types';
type WordHolderProps = {
    word: string;
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
    var guessLeft = Array.from(guess)
    const movedOverPlaceholder = '_'
    // Pass 1
    for(let i = 0; i < guess.length; i++) {
        if (guessLeft[i] == wordLeft[i]) {
            // Mark both letters as having been used up for further analysis
            wordLeft[i] = movedOverPlaceholder
            guessLeft[i] = movedOverPlaceholder
            coloring[i] = Correctness.Correct
        }
    }
    for(let i = 0; i < guess.length; i++) {
        if (wordLeft[i] == movedOverPlaceholder) {
            // This letter is already green
            continue
        }
        for(let j = 0; j < guess.length; j++) {
            if (wordLeft[i] == guessLeft[j]) {
                wordLeft[i] = movedOverPlaceholder
                guessLeft[j] = movedOverPlaceholder
                coloring[j] = Correctness.WrongPosition
                break
            }
        }
    }

    let letters = Array.from(guess).map((l, i) => <td key={i} style={{backgroundColor: coloring[i]}}>{l}</td>)
    return (
        <tr key={props.word + guess} style={{height: '27px', maxHeight: '27px'}}>{letters}</tr>
    )
}

// Only the current input!
function renderInputAsRow(guess: string) : React.ReactElement {
    let letters = Array.from(guess.padEnd(WordLength, " ")).map((l, i) => <td key={i}>{l}</td>)
    return (
        <tr key="input" style={{height: '27px', maxHeight: '27px'}}>{letters}</tr>
    )
}

function renderUnaccessedRows(count: Number) : React.ReactElement {
    let results = [...Array(count).keys()].map(i =>
        <tr key={i}>{[...Array(WordLength).keys()].map(j => <td key={j}></td>)}</tr>
    )
    return <>{results}</>
}

function renderSolved(props: WordHolderProps, solvedIndex: number): React.ReactElement {
    let previousWords = props.gameState.history.slice(0, solvedIndex+1).map(h => renderGuessAsRow(h, props))
    return (
        <>
        <table>
            <tbody>
                {previousWords}
            </tbody>
        </table>
        </>
    )
}

function renderUnsolved(props: WordHolderProps) : React.ReactElement {
    let previousWords = props.gameState.history.map(h => renderGuessAsRow(h, props))
    let current = renderInputAsRow(props.gameState.currentWord)
    let unaccessedRowCount = MaxGuesses - (previousWords.length + 1)
    let unaccessedRows = renderUnaccessedRows(unaccessedRowCount)
    return (
        <>
        <table>
            <tbody>
                {previousWords}
                {current}
                {unaccessedRows}
            </tbody>
        </table>
        </>
    )
}

function WordHolder(props: WordHolderProps) {
    let solvedIndex = props.gameState.history.indexOf(props.word);
    if (solvedIndex == -1) {
        return renderUnsolved(props)
    } else {
        return renderSolved(props, solvedIndex)
    }
}

export {WordHolder}
