// import { MaxGuesses, WordLength } from './Constants'
import { MaxGuesses, WordLength } from './Constants';
import { Correctness, GameState } from './Types';
import { createCompletionStatus, getHistory } from './WordLogic';
type WordHolderProps = {
    word: string;
    gameState: GameState,
    autoComplete: () => void
}

function renderHistory(historyColoring: [string, Correctness[]][]): React.ReactElement {
    return <>
        {historyColoring.map(([word, correctness], i) =>
            <>
                <tr key={`${word}-${i}`} style={{ height: '27px', maxHeight: '27px' }}>
                    {
                        correctness.map((c, j) => <td key={`${word}-${j}-${i}`} style={{ backgroundColor: c }}>{word[j]}</td>)
                    }
                </tr>
            </>
        )}
    </>
}



// Only the current input!
function renderInputAsRow(guess: string): React.ReactElement {
    let letters = Array.from(guess.padEnd(WordLength, " ")).map((l, i) => <td key={i}>{l}</td>)
    return (
        <tr key="input" style={{ height: '27px', maxHeight: '27px' }}>{letters}</tr>
    )
}

function renderUnaccessedRows(count: number): React.ReactElement {
    if (count < 0) return <></>
    let results = [...Array(count).keys()].map(i =>
        <tr key={i}>{[...Array(WordLength).keys()].map(j => <td key={`${i}-${j}`}></td>)}</tr>
    )
    return <>{results}</>
}

function renderSolved(props: WordHolderProps, solvedIndex: number): React.ReactElement {
    // let previousWords = props.gameState.history.slice(0, solvedIndex + 1).map(h => renderHistoryPerRow(h, props.word))
    let history = getHistory(props.word, props.gameState.history.slice(0, solvedIndex + 1))
    return (
        <>
            ✅
            <table>
                <tbody>
                    {renderHistory(history)}
                </tbody>
            </table>
        </>
    )
}

function correctnessToEmoji(c: Correctness): string {
    switch (c) {
        case Correctness.Correct: return '🟩'
        case Correctness.WrongPosition: return '🟨'
        case Correctness.NotInThere: return '🟥'
        case Correctness.LastLeft: return '🟦'
    }
}


function renderUnsolved(props: WordHolderProps): React.ReactElement {
    let history = getHistory(props.word, props.gameState.history)
    let fullHistory = createCompletionStatus(props.word, history)
    let historyRender = renderHistory(fullHistory.history)
    let current = renderInputAsRow(props.gameState.currentGuess)
    let unaccessedRowCount = MaxGuesses - (history.length + 1)
    let unaccessedRows = renderUnaccessedRows(unaccessedRowCount)
    let className = fullHistory.canAutoComplete ? 'auto-complete' : ''
    let title = fullHistory.canAutoComplete ? 'Click to complete' : ''
    return (
        <>
            <div>
                {fullHistory.autoCompleteColoring.map(correctnessToEmoji)}
            </div>
            <table title={title} className={className} onClick={() => fullHistory.canAutoComplete && props.autoComplete()}>
                <tbody>
                    {historyRender}
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

export { WordHolder }
