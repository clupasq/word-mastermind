/**
 * Returns a string of digits the same size as the words.
 * For each letter there's a:
 * - 0 if the letter is not present in the word
 * - 1 if the letter is present in the word but at another location
 * - 2 if the letter is not present in the word and placed correctly
 */
const computeResult = (guess, correct) => {
    const result = []
    const available = new Map()
    for (const letter of correct) {
        available[letter] = (available[letter] ?? 0) + 1
        result.push(0)
    }

    // check good letters placed correctly
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i]
        if (letter === correct[i]) {
            result[i] = 2
            available[letter]--
        }
    }

    // check good letters placed incorrectly
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i]
        if (letter === correct[i]) {
            continue
        }
        if (available[letter] ?? 0 > 0) {
            available[letter]--
            result[i] = 1
        }
    }

    return result.join("")
}

class Game {

    constructor(dictionary, options={}) {
        this.totalAttempts = options.totalAttempts || 5
        this.dictionary = dictionary
        if (options.word) {
            if (!dictionary.hasWord(options.word)) {
                throw new Error(`Word not in dictionary: '${options.word}'`)
            }
        }
        this.word = (options.word || dictionary.selectRandomWord()).toUpperCase()
        this.finished = false
        this.won = false
        this.currentGuess = 0
    }

    start() {
        return {
            totalAttempts: this.totalAttempts,
            wordLength: this.dictionary.getWordLength()
        }
    }

    submitGuess(guess) {
        guess = guess.toUpperCase()
        if (!this.dictionary.hasWord(guess)) {
            return {
                error: "Not in dictionary"
            }
        }
        if (this.finished) {
            throw new Error("Game finished")
        }
        this.currentGuess++

        if (guess === this.word) {
            this.won = true
            this.finished = true
            return {
                finished: true,
                won: true,
                result: computeResult(guess, this.word)
            }
        }
        if (this.currentGuess >= this.totalAttempts) {
            this.finished = true
            return {
                result: computeResult(guess, this.word),
                finished: this.finished,
                word: this.word,
            }
        }

        return {
            result: computeResult(guess, this.word),
            currentGuess: this.currentGuess,
        }
    }
}

module.exports = { Game }
