// Most things in here shamelessly ripped from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// Unfortunately JS/TS don't have good random libraries q.q

import { NumberOfWordles } from "./Constants";
import { WordList } from "./WordList";

function cyrb128(str: string) : Array<number> {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function splitmix32(a: number) : (() => number) {
    return function() : number {
      a |= 0;
      a = a + 0x9e3779b9 | 0;
      let t = a ^ a >>> 16;
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ t >>> 15;
      t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
     }
   }

// https://stackoverflow.com/a/72772305
// Someone should really make a standard library for this language q.q
const rand = splitmix32(cyrb128(new Date().toISOString().split('T')[0])[0])

function getWordList() : Array<string> {
    var arr = []
    for(let i = 0; i < NumberOfWordles; i++) {
        var number = Math.floor(rand() * WordList.length);
        while (arr.indexOf(WordList[number]) != -1) {
            number = Math.floor(rand() * WordList.length);
        }
        arr.push(WordList[number])
    }
    return arr
}

export { getWordList }
