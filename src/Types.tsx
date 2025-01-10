type GameState = {
  currentGuess: string
  history: Array<string>
}
interface LooseObject {
  [key: string]: any
}

// This is currently being reused to both color the history in a wordholder
// as well as the emoji on top of a wordholder to indicate autocompletion status
enum Correctness {
  Correct = "rgb(8, 159, 18)",
  WrongPosition = "rgb(198, 178, 0)",
  LastLeft = "rgb(38, 96, 255)",
  NotInThere = "Black"
}
export type { GameState, LooseObject }
export { Correctness }