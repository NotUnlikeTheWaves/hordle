import { WordLength } from "./Constants";
import { Correctness } from "./Types";

type AutoCompleteStatus = {
    autoCompleteColoring: Array<Correctness>
    history: [string, Correctness[]][]
    canAutoComplete: boolean
}

function createHistoryWithCompletion(word: string, history: [string, Correctness[]][]): AutoCompleteStatus {
    let colors: Array<Correctness> = [...Array(WordLength)].fill(Correctness.NotInThere)
    // Pass 1: Looking in the verticals, see if any are green
    let vertCorrectness = history.map(i => i[1])
    if (vertCorrectness.length) {
        let coloredHistory = vertCorrectness[0].map((_, colIndex) => vertCorrectness.map(row => row[colIndex])); // https://stackoverflow.com/a/17428705
        for (let i = colors.length - 1; i >= 0; i--) { // descend so we can delete from the array too
            if (coloredHistory[i].some(h => h == Correctness.Correct)) {
                colors[i] = Correctness.Correct
                coloredHistory.splice(i, 1)
            }
        }
    }

    // Pass two: Look vertical to see if any one is still missing
    if (colors.filter(c => c == Correctness.NotInThere).length == 1) {
        let missingIndex = colors.indexOf(Correctness.NotInThere)
        let missingLetter = word[missingIndex]
        let skip = Array.from(word).filter(l => l == missingLetter).length - 1
        outer:
        for (let i = history.length - 1; i >= 0; i--) {
            let iSkip = skip
            let hWord = history[i][0]
            for (let j = 0; j < hWord.length; j++) {
                if (hWord[j] == missingLetter) {
                    if (iSkip == 0) {
                        history[i][1][j] = Correctness.LastLeft
                        colors[missingIndex] = Correctness.LastLeft
                        break outer
                    }
                    iSkip--
                }
            }
        }
    }
    return {
        autoCompleteColoring: colors,
        history: history,
        canAutoComplete: !colors.some(c => c == Correctness.NotInThere)
    }
}

function getHistory(word: string, historicGuesses: Array<string>): [string, Correctness[]][] {
    return historicGuesses.map(h => [h, getHistoryPerRow(h, word)])
}

function getHistoryPerRow(guess: String, word: string): Array<Correctness> {
    var coloring: Array<Correctness> = [...Array(guess.length)].fill(Correctness.NotInThere);
    var wordLeft = Array.from(word);
    var guessLeft = Array.from(guess);
    const movedOverPlaceholder = '_';
    // Pass 1: Set right positions
    for (let i = 0; i < guess.length; i++) {
        if (guessLeft[i] == wordLeft[i]) {
            // Mark both letters as having been used up for further analysis
            wordLeft[i] = movedOverPlaceholder;
            guessLeft[i] = movedOverPlaceholder;
            coloring[i] = Correctness.Correct;
        }
    }
    // Pass 2: Create yellows
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
    // Pass 3: See if one letter is in the wrong place and can be used to autocomplete
    // Do in reverse so it lights up better
    let currentGreens = coloring.filter(c => c == Correctness.Correct).length
    if (currentGreens == WordLength - 1) {

        for (let i = coloring.length - 1; i >= 0; i--) {

        }
    }
    return coloring;
}

export type { AutoCompleteStatus }
export { getHistory, createHistoryWithCompletion as createCompletionStatus }