import { WordLength } from "./Constants";
import { Correctness } from "./Types";

type AutoCompleteStatus = {
    status: Array<Correctness>
    canAutoComplete: boolean
}

function createCompletionStatus(word: string, history_: [string, Correctness[]][]): AutoCompleteStatus {
    let colors: Array<Correctness> = [...Array(WordLength)].fill(Correctness.NotInThere)
    let history = history_.map(i => i[1])
    if (history.length) {
        let coloredHistory = history[0].map((_, colIndex) => history.map(row => row[colIndex])); // https://stackoverflow.com/a/17428705
        for (let i = colors.length - 1; i >= 0; i--) { // descend so we can delete from the array too
            if (coloredHistory[i].some(h => h == Correctness.Correct)) {
                colors[i] = Correctness.Correct
                coloredHistory.splice(i, 1)
            }
        }
    }
    return {
        status: colors,
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
export { getHistory, createCompletionStatus }