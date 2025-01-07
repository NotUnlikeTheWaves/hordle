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
function renderHistoryPerRow(historicGuess: String, props: WordHolderProps) : React.ReactElement {
    // 2 pass coloring: GREEN (correct), YELLOW (it's there somewhere)
    var coloring: Array<Correctness> = getHistoryColoring(historicGuess, props);

    let letters = Array.from(historicGuess).map((l, i) => <td key={i} style={{backgroundColor: coloring[i]}}>{l}</td>)
    return (
        <tr key={props.word + historicGuess} style={{height: '27px', maxHeight: '27px'}}>{letters}</tr>
    )
}

function getHistoryColoring(guess: String, props: WordHolderProps) : Array<Correctness> {
    var coloring: Array<Correctness> = [...Array(guess.length)].fill(Correctness.NotInThere);
    var wordLeft = Array.from(props.word);
    var guessLeft = Array.from(guess);
    const movedOverPlaceholder = '_';
    // Pass 1
    for (let i = 0; i < guess.length; i++) {
        if (guessLeft[i] == wordLeft[i]) {
            // Mark both letters as having been used up for further analysis
            wordLeft[i] = movedOverPlaceholder;
            guessLeft[i] = movedOverPlaceholder;
            coloring[i] = Correctness.Correct;
        }
    }
    for (let i = 0; i < guess.length; i++) {
        if (wordLeft[i] == movedOverPlaceholder) {
            // This letter is already green
            continue;
        }
        for (let j = 0; j < guess.length; j++) {
            if (wordLeft[i] == guessLeft[j]) {
                wordLeft[i] = movedOverPlaceholder;
                guessLeft[j] = movedOverPlaceholder;
                coloring[j] = Correctness.WrongPosition;
                break;
            }
        }
    }
    return coloring;
}

// Only the current input!
function renderInputAsRow(guess: string) : React.ReactElement {
    let letters = Array.from(guess.padEnd(WordLength, " ")).map((l, i) => <td key={i}>{l}</td>)
    return (
        <tr key="input" style={{height: '27px', maxHeight: '27px'}}>{letters}</tr>
    )
}

function renderUnaccessedRows(count: number) : React.ReactElement {
    if(count < 0) return <></>
    let results = [...Array(count).keys()].map(i =>
        <tr key={i}>{[...Array(WordLength).keys()].map(j => <td key={j}></td>)}</tr>
    )
    return <>{results}</>
}

function renderSolved(props: WordHolderProps, solvedIndex: number): React.ReactElement {
    let previousWords = props.gameState.history.slice(0, solvedIndex+1).map(h => renderHistoryPerRow(h, props))
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

function correctnessToEmoji(c: Correctness) : string {
    switch(c) {
        case Correctness.Correct: return '🟩'
        case Correctness.WrongPosition: return '🟨'
        case Correctness.NotInThere: return '🟥'
    }
}

function renderIcons(props: WordHolderProps) : React.ReactElement {
    let colors = [...Array(WordLength)].fill(Correctness.NotInThere)
    if(props.gameState.history.length) {
        let array = props.gameState.history.map(h => getHistoryColoring(h, props))
        let coloredHistory = array[0].map((_, colIndex) => array.map(row => row[colIndex])); // https://stackoverflow.com/a/17428705
        // pass one
        for(let i = colors.length - 1; i >= 0; i--) { // descend so we can delete from the array too
            if (coloredHistory[i].some(h => h == Correctness.Correct)) {
                colors[i] = Correctness.Correct
                coloredHistory.splice(i, 1)
            }
        }
    }
    return <>{colors.map(correctnessToEmoji)}</>
}

function renderUnsolved(props: WordHolderProps) : React.ReactElement {
    let previousWords = props.gameState.history.map(h => renderHistoryPerRow(h, props))
    let current = renderInputAsRow(props.gameState.currentWord)
    let unaccessedRowCount = MaxGuesses - (previousWords.length + 1)
    let unaccessedRows = renderUnaccessedRows(unaccessedRowCount)
    return (
        <>
        <div>
            {renderIcons(props)}
        </div>
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
