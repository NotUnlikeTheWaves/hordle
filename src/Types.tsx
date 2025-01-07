type GameState = {
    currentWord: string
    history: Array<string>
}
interface LooseObject {
    [key: string]: any
  }
export type {GameState, LooseObject}
