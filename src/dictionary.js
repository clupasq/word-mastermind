const fs = require("fs")
const path = require("path")
const {promisify} = require("util")

const readFileAsync = promisify(fs.readFile)

class Dictionary {

    constructor(words) {
        this.length = undefined;
        this.words = [];
        for (const w of words) {
            if (this.length === undefined) {
                this.length = w.length
            } else if (this.length !== w.length) {
                throw new Error("Inconsistent word lengths")
            }

            this.words.push(w.toUpperCase())
        }
        this.wordSet = new Set(this.words)
    }

    hasWord(word) {
        return this.wordSet.has(word.toUpperCase())
    }

    selectRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.words.length)
        return this.words[randomIndex]
    }

    getWordLength() {
        return this.length
    }

}

Dictionary.create = async (dictFileName) => {
    const contents = await readFileAsync(path.join(__dirname, "../dict", dictFileName), "utf8")
    return new Dictionary(contents
        .split("\n")
        .filter(w => w.length > 0))
}

module.exports = { Dictionary }
